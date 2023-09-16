export interface IAIChatResponseBody {
  status: string;
  answer: string;
  question: string;
}

interface ITrainingFileConfig {
  [index: string]: string[]
}

type TTrainingFolderConfig = Record<string, ITrainingFileConfig>;

export type TTrainingConfig = Record<string, TTrainingFolderConfig>;
