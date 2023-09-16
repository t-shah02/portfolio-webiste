export const SERVER_PORT = process.env.PORT || 3000;
export const CLIENT_BASE_URL =
  process.env.CLIENT_BASE_URL || "http://localhost:5173";
export const SERVER_ENV = process.env.SERVER_ENV || "development";

export const EMAIL_RATE_LIMIT_WINDOW_MS = 1000 * 60 * 60 * 10;
export const EMAIL_RATE_LIMIT_WINDOW_MAX_REQUESTS = 2;
export const AI_CHAT_RATE_LIMIT_WINDOW_MS = 1000 * 60;
export const AI_CHAT_RATE_LIMIT_WINDOW_MAX_REQUESTS = 7;
