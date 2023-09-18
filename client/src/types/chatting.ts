export enum ESenderType {
  User,
  Chatbot,
}

export interface IChatMessage {
  id: string;
  content: string;
  dateSent: number;
  type: ESenderType;
}
