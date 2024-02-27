import express from "express";
import { ChatOpenAI } from "@langchain/openai";

const router = express.Router();

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
        `Generate movie recommendations based on my preferences: {userInput}.
        My age is {userAge}.
        And my favorate genre is {userGenre}.
        Write them in this format:
        1. "Movie" (Year)`;

        const prompt = promptTemplate
        .replace("{userInput}", userInput)
        .replace("{userGenre}", userGenre)
        .replace("{userAge }", userAge);

        // Invoke OpenAI model with the constructed prompt
        const movieRecommendations = await model.invoke(prompt);
        console.log(movieRecommendations);

        
        
        // Send recommendations in the response
        res.json(movieRecommendations);
        
    } catch (error) {
        console.error("Error generating movie recommendations:", error);
        res.status(500).json({ error: "Failed to generate movie recommendations" });
    }
});

export default router;

