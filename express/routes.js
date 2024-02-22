import express from "express";
import { ChatOpenAI } from "@langchain/openai";

const router = express.Router();

router.get('/joke', async (req, res) => {
    const model = new ChatOpenAI({
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
        azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
        azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    });

    const joke = await model.invoke("give me a game idea");

    res.json({
        joke: joke.content
    });
});

export default router;
