import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

console.log(`[Queue] Connecting to Redis at: ${redisUrl}`);

export const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

export const assessmentQueue = new Queue('assessment-queue', {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
