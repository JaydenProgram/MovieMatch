import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import fetchMovies from "./functions/getMovieImages.js";
//memory imports
import { BufferMemory } from "langchain/memory";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";

const router = express.Router();

router.post('/recommendations', async (req, res) => {
    try {


        // user input from front end
        const userInput = req.body.userInput;
        let totalTokens;

        // Create the model
        const model = new ChatOpenAI({
            azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
            azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
            azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
            azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
            temperature: 0.2,
            callbacks: [
                {
                    handleLLMEnd(output) {
                        totalTokens =  (JSON.stringify(output.llmOutput.tokenUsage.totalTokens));
                    },
                },
            ],
        });


        //Prompt Template
        const prompt = ChatPromptTemplate.fromTemplate(
            `You are a movie recommending bot that only recommends hidden gem movies. 
                     Meaning they are most of the time old and made a long time ago. Lets keep them from before the year 2000. 
                     Before doing anything i want you to check our previous conversation: {history}. This is Json and has both a HumanMessage and AIMessage. Its an array meaning the first
                     messages where our first chat messages, look in this content to generate better results to our chats.
                     The users information to get these recommendations is here: {userInput}
                     Format: {formatInstructions}
                    `
        );

        const upstashChatHistory = new UpstashRedisChatMessageHistory({
            sessionId: 'chat1',
            config: {
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            }
        })

        const memory = new BufferMemory({
            memoryKey: "history",
            chatHistory: upstashChatHistory,
        });

        // Parser
        const parser = StructuredOutputParser.fromZodSchema(
            z.object({
                recommendations: z.array(
                    z.object({
                        id: z.number().describe("Movies id starting from 1"),
                        name: z.string().describe("Name of the movie"),
                        description: z.string().describe("Extra info about movie"),
                        year: z.number().describe("Year movie was published"),
                    })
                ).max(6).describe("List of recommended movies (up to 6)"),
                chatInfo: z.string().describe(`please just chat about what im talking about
                in the conversion in this string. for example answering my name and stuff. If you sent
                movie info here, only give the names.`),
            })
        );

        const formatInstructions = parser.getFormatInstructions();


        const chain = RunnableSequence.from([
            {
                userInput: (initialInput) => initialInput.userInput,
                memory: () => memory.loadMemoryVariables(),
                formatInstructions: (initialInput) => initialInput.formatInstructions, // Include format_instructions here
            },
            {
                userInput: (previousOutput) => previousOutput.userInput,
                history: (previousOutput) => previousOutput.memory.history,
                formatInstructions: (previousOutput) => previousOutput.formatInstructions, // Pass format_instructions to the next step
            },
            prompt,
            model,
        ]).pipe(parser);

        // const chain = prompt.pipe(model).pipe(parser);
        // await chatHistoryInfo.addMessage(new HumanMessage(userInput));
        // Invoke OpenAI model with the constructed prompt
        let movieRecommendations
        try {
            movieRecommendations = await chain.invoke({
                userInput,
                formatInstructions,
            });
        } catch (e) {
            console.log(e);
        }



        // This makes sure that the input and output are both seen as (1 key) important!
        let testInput = {
            userInput: userInput
        }
        let testOutput = {
            output: movieRecommendations.chatInfo
        }

        // Saves the memory
        await memory.saveContext(testInput, {
            testOutput
        })


        // Function to fetch movie details and add poster path
        const movieImages = await fetchMovies(movieRecommendations);

        console.log(movieRecommendations);

        res.json({main: movieImages, chatInfo: movieRecommendations.chatInfo, totalTokens: totalTokens});

    } catch (error) {
        console.error("Error generating movie recommendations:", error);
        res.status(500).json({ error: "Failed to generate movie recommendations" });
    }
});

export default router;

