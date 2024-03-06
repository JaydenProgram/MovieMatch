import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

const router = express.Router();
// POST endpoint for user input
router.post('/recommendations', async (req, res) => {
    try {
        // user input from front end
        const userInput = req.body.userInput;
        const userGenre = req.body.userGenre;
        const userAge = req.body.userAge;
        // Create the model
        const model = new ChatOpenAI({
            azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
            azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
            azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
            azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
            temperature: 0.2,
        });

        //Prompt Template
        const prompt = ChatPromptTemplate.fromTemplate(
            `Give movie recommendations based on the following user info:
            Formatting Instructions: {format_instructions}
            User info: {userInput}`
        );

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
            })
        );

        //Create chain with prompt and model
        const chain = prompt.pipe(model).pipe(parser);

        // await chatHistoryInfo.addMessage(new HumanMessage(userInput));
        // Invoke OpenAI model with the constructed prompt
        const movieRecommendations = await chain.invoke({
            userInput: userInput,
            format_instructions: parser.getFormatInstructions(),
        });

        // await chatHistoryInfo.addMessage(new AIMessage(movieRecommendations.content));



        // Send recommendations in the response
        res.json(movieRecommendations.recommendations);

    } catch (error) {
        console.error("Error generating movie recommendations:", error);
        res.status(500).json({ error: "Failed to generate movie recommendations" });
    }
});

export default router;

