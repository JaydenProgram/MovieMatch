import { OpenAI } from "@langchain/llms/openai";
import { promptTemplate } from "@langchain/prompts";
import { LLMChain } from "@langchain/chains";

const model = new OpenAI({ temperature: 0 });

const template = "Be very weird when awnsering this question\n Question: {question}";
const prompt = new promptTemplate({})