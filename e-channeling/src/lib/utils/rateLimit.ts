import { redis } from "../db/redis";

const MAX_ATTEMPTS = 3;
const WINDOW_SECONDS = 60;

export async function rateLimit(
    identifier: string,
    maxAttempts: number = MAX_ATTEMPTS
): Promise<boolean> {
    // create a key
    const key = `rate_limit:${identifier}`;

    // store the count of attemps in the redis
    const attempts = await redis.incr(key);

    // Delete this key automatically after 60 seconds
    if (attempts === 1) {
        await redis.expire(key, WINDOW_SECONDS);
    }

    if (attempts > maxAttempts) return false;

    return true;
}
