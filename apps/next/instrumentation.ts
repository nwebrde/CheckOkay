import { CheckJob, NotificationJob } from './server/adapters/scheduler/config'
export const register = async () => {

    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('./sentry.server.config');

        const { sendMail } = await import('./server/controllers/notifications/NotificationChannelController');
        const { Worker } = await import('bullmq');
        const { redisConnection } = await import('./server/adapters/scheduler/config');

        const { WarningNotifier } = await import('./server/controllers/notifications/ConcreteNotifiers');
        const { toConcreteNotification } = await import('./server/controllers/notifications/ConcreteNotifications');
        const { STANDARD_QUEUE_JOBS } = await import('./server/adapters/scheduler/repeatingNotifiers');
        const { CHECK_QUEUE, EMAIL_QUEUE, STANDARD_QUEUE } = await import('./server/adapters/scheduler/config');
        const { remind, warn } = await import('./server/controllers/checkState');
        const {CheckSteps} = await import('./server/adapters/scheduler/config');
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

        new Worker<NotificationJob>(EMAIL_QUEUE, async (job) => {
            await sendMail(job.data.address, job.data.recipient, job.data.notification)
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

