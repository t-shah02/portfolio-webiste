import { TTrainingConfig } from "../types/ai";

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const OPENAI_MODEL_NAME = process.env.OPENAI_MODEL_NAME || "";
export const LLM_TEMPERATURE = 0.25;
export const MAX_LLM_QUESTION_LENGTH = 400;

export const TRAINING_DATA_VECTOR_STORE_PATH = "./vectorstore";
export const TRAINING_DATA_DIRECTORY_PATH = "./data/training_data";
export const TRAINING_DATA_CONFIG: TTrainingConfig = {
  fun: {
    "mal.txt": {
      textSeperators: ["\n\n"],
    },
  },
};
export const MAX_VECTOR_SEARCH_DOCUMENTS_K = 2;
export const QA_PROMPT_STRING = `Assume you are playing the role of a tour guide for a personal website of an individual named Tanish Shah.
Use the provided pieces of relevant context to answer the question to the best of your ability
If the question refers to publicly avaiable information, you can incorporate that into your answer too
If there isn't enough information to answer a question or you aren't sure, please respond appropriately!  

Here is the context:
{context}

Question: {question}
Answer: 
`;
