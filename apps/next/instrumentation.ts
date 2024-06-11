import { CheckJob, EmailJob, PushJob } from './server/adapters/scheduler/config'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/de'
import dayjs from 'dayjs'

export const register = async () => {

    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('./sentry.server.config');

        dayjs.locale('de')
        dayjs.extend(relativeTime)

        const { sendMail, sendPush, checkPush } = await import('./server/controllers/notifications/NotificationChannelController');
        const { Worker } = await import('bullmq');
        const { redisConnection } = await import('./server/adapters/scheduler/config');

        const { WarningNotifier } = await import('./server/controllers/notifications/ConcreteNotifiers');
        const { toConcreteNotification } = await import('./server/controllers/notifications/ConcreteNotifications');
        const { STANDARD_QUEUE_JOBS } = await import('./server/adapters/scheduler/config');
        const { CHECK_QUEUE, EMAIL_QUEUE, STANDARD_QUEUE, PUSH_QUEUE } = await import('./server/adapters/scheduler/config');
        const { remind, warn } = await import('./server/controllers/checkState');
        const {CheckSteps} = await import('./server/adapters/scheduler/config');
        const { checkTickets } = await import('./server/adapters/notificationChannels/push');
        const { DelayedError } = await import('bullmq');

        new Worker<CheckJob>(CHECK_QUEUE, async (job, token?: string) => {
            let delay;
            switch (job.data.step) {
                case CheckSteps.REMINDER:
                    await remind(job.data.userId)
                    delay = Number(new Date(job.data.checkDate)) - Number(new Date())
                    if(delay < 0) {
                        delay = 0;
                    }
                    await job.moveToDelayed(Date.now() + delay, token);
                    await job.updateData({
                        step: CheckSteps.CHECK,
                        checkDate: job.data.checkDate,
                        userId: job.data.userId,
                        backupDate: job.data.backupDate
                    });
                    throw new DelayedError();
                case CheckSteps.CHECK:
                    await warn(job.data.userId, false)
                    if(job.data.backupDate) {
                        delay = Number(new Date(job.data.backupDate)) - Number(new Date())
                        if(delay < 0) {
                            delay = 0;
                        }
                        await job.moveToDelayed(Date.now() + delay, token);
                        await job.updateData({
                            step: CheckSteps.BACKUP,
                            checkDate: job.data.checkDate,
                            userId: job.data.userId,
                            backupDate: job.data.backupDate
                        });
                        throw new DelayedError();
                    }
                    break;
                case CheckSteps.BACKUP:
                    await warn(job.data.userId, true)
                    break;
            }
        }, {
            connection: redisConnection,
            concurrency: 1,
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 5000 },
        });

        new Worker<EmailJob>(EMAIL_QUEUE, async (job) => {
            await sendMail(job.data.address, job.data.recipient!, job.data.notification)
        }, {
            connection: redisConnection,
            concurrency: 1,
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 5000 },
        });

        new Worker<PushJob>(PUSH_QUEUE, async (job) => {
            const failedJobs = await sendPush(job.data.tokens, job.data.notification);
            if(failedJobs.length > 0) {
                await job.updateData({
                    notification: job.data.notification,
                    tokens: failedJobs,
                    checkTickets: job.data.checkTickets
                })
                throw new Error("Some push notifications could not be send")
            }
        }, {
            connection: redisConnection,
            concurrency: 1,
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 5000 },
        });

        new Worker(STANDARD_QUEUE, async (job) => {
            switch (job.name) {
                case STANDARD_QUEUE_JOBS.REPEATING_NOTIFIER:
                    // TODO switch for different repeating notifier implementations
                    const notifier = new WarningNotifier(job.data.notifier.userId, job.data.notifier.guardType, toConcreteNotification(job.data.notifier.notification), job.data.notifier.currentRound)
                    await notifier.submit()
                    break;
                case STANDARD_QUEUE_JOBS.PUSH_TICKET:
                    const failedReceipts = await checkPush(job.data.tickets, job.data.notification)
                    if(failedReceipts.length > 0) {
                        await job.updateData({
                            notification: job.data.notification,
                            tickets: failedReceipts
                        })
                        throw new Error("Some push notification receipts could not be checked")
                    }
                    break;
                default:
                    break;
            }
        }, {
            connection: redisConnection,
            concurrency: 1,
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 5000 },
        });
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
        await import('./sentry.edge.config');
    }
};

