import { Queue } from 'bullmq';
import Redis from 'ioredis';
import {Recipient, Notification} from "../../entities/notifications/Notifications";

declare global {
    var redis:
        Redis | undefined
}

let connection: Redis;

if (process.env.NODE_ENV === 'production') {
    connection = createRedisConnection();
}

else {
    if (!global.redis) {
        global.redis = createRedisConnection()
    }
    connection = global.redis!
}

function createRedisConnection() {
    return new Redis(process.env.REDIS_URL!, {
        maxRetriesPerRequest: null
    })
}

export const redisConnection = connection;

export const STANDARD_QUEUE = "queue";
export const CHECK_QUEUE = "checkQueue";
export const EMAIL_QUEUE = "emailQueue";
export const PUSH_QUEUE = "pushQueue";

export enum CheckSteps {
    REMINDER,
    CHECK,
    BACKUP
}

export type CheckJob = {
    step: CheckSteps;
    checkDate: Date;
    backupDate?: Date;
    userId: string;
    firstReminderSent: boolean;
    lastResortCheckIn: boolean;
}

export interface EmailJob {
    notification: Notification,
    recipient: Recipient,
    address: string
}

export interface PushJob {
    notification: Notification,
    tokens: string[]
    checkTickets: boolean
}

export enum STANDARD_QUEUE_JOBS {
    REPEATING_NOTIFIER = "REPEATING_NOTIFIER",
    PUSH_TICKET = "PUSH_TICKET"
}

export const checkQueue = new Queue<CheckJob>(CHECK_QUEUE, {
    connection,
    defaultJobOptions: {
        attempts: 18, // spans in sum three months
        backoff: {
            type: 'exponential',
            delay: 30000, // half minute
        }
    },
});

/**
 * Standard queue
 */
export const queue = new Queue(STANDARD_QUEUE, {
    connection,
    defaultJobOptions: {
        attempts: 1,
        removeOnComplete: true
    },
});


export const emailQueue = new Queue<EmailJob>(EMAIL_QUEUE, {
    connection,
    defaultJobOptions: {
        attempts: 13, // spans 2.8 days
        backoff: {
            type: 'exponential',
            delay: 30000, // half minute
        },
        removeOnComplete: true
    },
});

export const pushQueue = new Queue<PushJob>(PUSH_QUEUE, {
    connection,
    defaultJobOptions: {
        attempts: 13, // spans 2.8 days
        backoff: {
            type: 'exponential',
            delay: 30000, // half minute
        },
        removeOnComplete: true
    },
});