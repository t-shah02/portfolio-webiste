import { Redis, RedisOptions } from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "../constants/db";
import rateLimit from "express-rate-limit";
//@ts-ignore
import RedisStore from "rate-limit-redis";
import { AI_CHAT_RATE_LIMIT_WINDOW_MAX_REQUESTS, AI_CHAT_RATE_LIMIT_WINDOW_MS, EMAIL_RATE_LIMIT_WINDOW_MAX_REQUESTS, EMAIL_RATE_LIMIT_WINDOW_MS } from "../constants/server";

const options: RedisOptions = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT),
};
export const redisClient = new Redis(options);
export const redisRateLimiterStore = new RedisStore({
  // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
  sendCommand: (...args: string[]) => redisClient.call(...args),
});

export const emailRateLimiter = rateLimit({
  windowMs: EMAIL_RATE_LIMIT_WINDOW_MS,
  max: EMAIL_RATE_LIMIT_WINDOW_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisRateLimiterStore,
});

export const aiChatRateLimiter = rateLimit({
  windowMs: AI_CHAT_RATE_LIMIT_WINDOW_MS,
  max: AI_CHAT_RATE_LIMIT_WINDOW_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisRateLimiterStore,
});
