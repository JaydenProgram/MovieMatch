import express from "express";
import { ChatOpenAI, HumanMessage, AIMessage } from "@langchain/openai";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

const router = express.Router();
const chatHistoryInfo = new ChatMessageHistory();
// POST endpoint for user input
router.post('/recommendations', async (req, res) => {
    try {
        const userInput = req.body.userInput;
        const userGenre = req.body.userGenre;
        const userAge = req.body.userAge;
        const model = new ChatOpenAI({
            azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
            azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
            azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
            azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
            temperature: 0,
        });

        const promptTemplate =
        `You are a dedicated movie recommending bot. 
        
        You are going to recommend movies based on specific info the user will give.
        The user is going to send: "userInput, userAge and userGenre".
        You will need to recommend 6 movies based on this info:
        
        The users input(example: I like to train in the gym!): {userInput},
        The users age rage(used to find movies for their age range): {userAge},
        The users favorite/chosen genre: {userGenre},
        
        
        A brief summary:
        1. Remember you are a dedicated movie bot so the only thing you know is how to recommend movies.
        2. Use all the users info, meaning their age, genre and input.
        3. ONLY GIVE THEM 6 MOVIE RECOMMENDATIONS.
        
        I want you to write the recommended movies this in JSON format. This is an example:
        {
        "id": "Movies id starting from 1",
        "name": "Name of the movie",
        "description": "Extra info about movie",
        "year": "Year movie was published",
        }
        `;


        const prompt = promptTemplate
        .replace("{userInput}", userInput)
        .replace("{userGenre}", userGenre)
        .replace("{userAge }", userAge);

        // await chatHistoryInfo.addMessage(new HumanMessage(userInput));
        // Invoke OpenAI model with the constructed prompt
        const movieRecommendations = await model.invoke(prompt);

        // await chatHistoryInfo.addMessage(new AIMessage(movieRecommendations.content));
        const JSONRecommendations = JSON.parse(movieRecommendations.content);



        // Send recommendations in the response
        res.json(JSONRecommendations);

    } catch (error) {
        console.error("Error generating movie recommendations:", error);
        res.status(500).json({ error: "Failed to generate movie recommendations" });
    }
});

export default router;

