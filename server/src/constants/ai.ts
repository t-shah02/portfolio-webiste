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
      "textSeperators": ["\n\n"],
    },
  },
};

export const TEXT_SPLITTER_CHUNK_OVERLAP = 10;
export const TEXT_SPLITTER_CHUNK_SIZE = 75;
