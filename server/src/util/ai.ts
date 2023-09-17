import { OpenAI } from "langchain/llms/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import {
  LLM_TEMPERATURE,
  MAX_LLM_QUESTION_LENGTH,
  MAX_VECTOR_SEARCH_DOCUMENTS_K,
  OPENAI_API_KEY,
  OPENAI_MODEL_NAME,
  QA_PROMPT_STRING,
  TRAINING_DATA_CONFIG,
  TRAINING_DATA_DIRECTORY_PATH,
  TRAINING_DATA_VECTOR_STORE_PATH,
} from "../constants/ai";
import fs from "fs/promises";
import path from "path";

const getDocumentsFromTextFile = async (
  filePath: string,
): Promise<Document[]> => {
  const txtFileDocuments: Document[] = [];
  const rawContent = await fs.readFile(filePath, "utf-8");
  const splitRawContent = rawContent.split("\n\n");

  splitRawContent.forEach((currentTextSplit) => {
    const txtDoc = new Document({
      pageContent: currentTextSplit,
      metadata: {
        sourceFilePath: filePath,
      },
    });
    txtFileDocuments.push(txtDoc);
  });

  return txtFileDocuments;
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
      return await getDocumentsFromTextFile(trainingFilePath);

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

  const vectorStoreRetriever = vectorStore.asRetriever({
    k: MAX_VECTOR_SEARCH_DOCUMENTS_K,
  });

  const promptTemplate = PromptTemplate.fromTemplate(QA_PROMPT_STRING);

  const qaChain = new RetrievalQAChain({
    combineDocumentsChain: loadQAStuffChain(llm, { prompt: promptTemplate }),
    retriever: vectorStoreRetriever,
  });

  return qaChain;
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
