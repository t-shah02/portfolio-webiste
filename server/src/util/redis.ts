import { Redis, RedisOptions } from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "../constants/db";
import rateLimit from "express-rate-limit";
//@ts-ignore
import RedisStore from "rate-limit-redis";

const options: RedisOptions = {
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT)
}
export const redisClient = new Redis(options);
export const redisRateLimiterStore = new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => redisClient.call(...args),
});

const redisRateLimiter = rateLimit({
    windowMs: 1000 * 25,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    store: redisRateLimiterStore
})

export default redisRateLimiter;