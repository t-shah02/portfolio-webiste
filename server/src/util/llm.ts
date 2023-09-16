import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RetrievalQAChain } from "langchain/chains";
import { Document } from "langchain/document";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
  LLM_TEMPERATURE,
  MAX_LLM_QUESTION_LENGTH,
  OPENAI_API_KEY,
  OPENAI_MODEL_NAME,
  TEXT_SPLITTER_CHUNK_OVERLAP,
  TEXT_SPLITTER_CHUNK_SIZE,
  TRAINING_DATA_CONFIG,
  TRAINING_DATA_DIRECTORY_PATH,
  TRAINING_DATA_VECTOR_STORE_PATH,
} from "../constants/ai";
import fs from "fs/promises";
import path from "path";

const getDocumentsFromTextFile = async (
  filePath: string,
  textSeperators: string[],
): Promise<Document[]> => {
  const rawContent = await fs.readFile(filePath, "utf-8");
  const textSplitter = new RecursiveCharacterTextSplitter({
    separators: textSeperators,
    chunkOverlap: TEXT_SPLITTER_CHUNK_OVERLAP,
    chunkSize: TEXT_SPLITTER_CHUNK_SIZE,
  });

  return textSplitter.createDocuments([rawContent]);
};

const getDocumentsFromJSONFile = async (
  filePath: string,
  acceptedKeys: string[] = [],
): Promise<Document[]> => {
  const loader = new JSONLoader(filePath, acceptedKeys);
  return await loader.load();
};

const getFileDocuments = async (
  trainingFilePath: string,
): Promise<Document[]> => {
  const fileType = path.extname(trainingFilePath);
  const fileName = path.basename(trainingFilePath);
  const folderName = path.basename(path.dirname(trainingFilePath));

  const getConfigProperty = (
    fileName: string,
    folderName: string,
    configProperty: string,
  ): string[] => {
    try {
      return TRAINING_DATA_CONFIG[folderName][fileName][configProperty];
    } catch (_) {
      return [];
    }
  };

  switch (fileType) {
    case ".txt":
      const textSeperators = getConfigProperty(
        fileName,
        folderName,
        "textSeperators",
      );
      return await getDocumentsFromTextFile(trainingFilePath, textSeperators);

    case ".json":
      const jsonKeys = getConfigProperty(fileName, folderName, "jsonKeys");
      return await getDocumentsFromJSONFile(trainingFilePath, jsonKeys);

    default:
      return [];
  }
};

const getAllTrainingDocuments = async (): Promise<Document[]> => {
  const finalTrainingDocuments: Document[] = [];
  const trainingFolders = await fs.readdir(TRAINING_DATA_DIRECTORY_PATH);

  const getFolderDocumentsFileGroups = async (trainingFolderName: string) => {
    const trainingFolderPath = path.join(
      TRAINING_DATA_DIRECTORY_PATH,
      trainingFolderName,
    );
    const trainingFilesInFolder = await fs.readdir(trainingFolderPath);

    const getFileDocsHelper = async (
      trainingFileName: string,
    ): Promise<Document[]> => {
      const trainingFilePath = path.join(trainingFolderPath, trainingFileName);
      const relevantDocuments = await getFileDocuments(trainingFilePath);

      return relevantDocuments;
    };

    const folderDocumentsPromises =
      trainingFilesInFolder.map(getFileDocsHelper);
    const folderDocuments = await Promise.all(folderDocumentsPromises);

    return folderDocuments;
  };

  const trainingFolderFileGroupsPromises = trainingFolders.map(
    getFolderDocumentsFileGroups,
  );
  const trainingFolderFileGroups = await Promise.all(
    trainingFolderFileGroupsPromises,
  );

  trainingFolderFileGroups.forEach((folderFileGroup) => {
    folderFileGroup.forEach((fileGroup) => {
      fileGroup.forEach((fileDoc) => finalTrainingDocuments.push(fileDoc));
    });
  });

  return finalTrainingDocuments;
};

export async function constructQAChain(): Promise<RetrievalQAChain> {
  const llm = new OpenAI({
    openAIApiKey: OPENAI_API_KEY,
    temperature: LLM_TEMPERATURE,
    modelName: OPENAI_MODEL_NAME,
  });
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
  });

  const vectorStorePersisted = await (async () => {
    try {
      await fs.access(TRAINING_DATA_VECTOR_STORE_PATH);
      return true;
    } catch (_) {
      return false;
    }
  })();
  let vectorStore: HNSWLib;

  if (vectorStorePersisted) {
    vectorStore = await HNSWLib.load(
      TRAINING_DATA_VECTOR_STORE_PATH,
      embeddings,
    );
  } else {
    const trainingDocuments = await getAllTrainingDocuments();
    vectorStore = await HNSWLib.fromDocuments(trainingDocuments, embeddings);
    vectorStore.save(TRAINING_DATA_VECTOR_STORE_PATH);
  }

  const vectorStoreRetriever = vectorStore.asRetriever();

  const finalQAChain = RetrievalQAChain.fromLLM(llm, vectorStoreRetriever);
  return finalQAChain;
}

export async function answerQuestion(
  qaChain: RetrievalQAChain | null,
  question: string,
): Promise<string> {
  if (qaChain === null) {
    throw new Error(
      `This QA chain has not yet been initialized or is undefined`,
    );
  }

  if (question.length <= 0 || question.length > MAX_LLM_QUESTION_LENGTH) {
    throw new Error(
      `The LLM question length should be between 1 and ${MAX_LLM_QUESTION_LENGTH} characters long`,
    );
  }

  const aiAnswer = await qaChain.call({ query: question });
  return aiAnswer.text as string;
}
