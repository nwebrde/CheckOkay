import { CheckJob, CheckSteps, EmailJob, PushJob } from './server/adapters/scheduler/config'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/de'
import dayjs from 'dayjs'

declare global {
    let instrumentation:
        boolean | undefined
}


export const register = async () => {
    console.log("register instrument")
    if (!global.instrumentation) {
        global.instrumentation = true

        if (process.env.NEXT_RUNTIME === 'nodejs') {
            console.log("init workers")
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
            const { remind, warn, lastResortCheckIn } = await import('./server/controllers/checkState');
            const {CheckSteps} = await import('./server/adapters/scheduler/config');
            const { checkTickets } = await import('./server/adapters/notificationChannels/push');
            const { DelayedError } = await import('bullmq');
            const { UserDeleted } = await import('./server/controllers/checkState');


            new Worker<CheckJob>(CHECK_QUEUE, async (job, token?: string) => {
                let delay;

                switch (job.data.step) {
                    case CheckSteps.REMINDER:
                        if(!job.data.lastResortCheckIn) {
                            try {
                                await lastResortCheckIn(job.data.userId)
                            } catch (e) {
                                if (e instanceof UserDeleted) {
                                    // stop the job as user is deleted
                                    return
                                } else {
                                    throw e; // re-throw the error unchanged
                                }
                            }
                        }

                        else {
                            try {
                                await remind(job.data.userId, job.data.firstReminderSent)
                            } catch (e) {
                                if (e instanceof UserDeleted) {
                                    // stop the job as user is deleted
                                    return
                                } else {
                                    throw e; // re-throw the error unchanged
                                }
                            }
                        }

                        // check-in delay
                        delay = Number(new Date(job.data.checkDate)) - Number(new Date())

                        // normal reminder
                        if(!job.data.lastResortCheckIn && !job.data.firstReminderSent) {
                            delay = 2 * 60 * 1000
                            if(Number(new Date) + delay >= (Number(new Date(job.data.checkDate)) - 5 * 60 * 1000)) {
                                delay = 0
                            }
                        }

                        // critical reminder
                        else if((!job.data.lastResortCheckIn && job.data.firstReminderSent) || (job.data.lastResortCheckIn && !job.data.firstReminderSent)) {
                            delay = Number(new Date(job.data.checkDate)) - Number(new Date()) - 5 * 60 * 1000
                        }

                        if(delay < 0) {
                            delay = 0;
                        }

                        await job.moveToDelayed(Date.now() + delay, token);
                        await job.updateData({
                            step: (job.data.lastResortCheckIn && job.data.firstReminderSent) ? CheckSteps.CHECK : CheckSteps.REMINDER,
                            firstReminderSent: job.data.firstReminderSent || job.data.lastResortCheckIn,
                            lastResortCheckIn: true,
                            checkDate: job.data.checkDate,
                            userId: job.data.userId,
                            backupDate: job.data.backupDate
                        });
                        throw new DelayedError();
                    case CheckSteps.CHECK:
                        try {
                            await warn(job.data.userId, false)
                        } catch (e) {
                            if (e instanceof UserDeleted) {
                                // stop the job as user is deleted
                                return
                            } else {
                                throw e; // re-throw the error unchanged
                            }
                        }
                        if(job.data.backupDate) {
                            delay = Number(new Date(job.data.backupDate)) - Number(new Date())
                            if(delay < 0) {
                                delay = 0;
                            }
                            await job.moveToDelayed(Date.now() + delay, token);
                            await job.updateData({
                                step: CheckSteps.BACKUP,
                                firstReminderSent: job.data.firstReminderSent,
                                lastResortCheckIn: job.data.lastResortCheckIn,
                                checkDate: job.data.checkDate,
                                userId: job.data.userId,
                                backupDate: job.data.backupDate
                            });
                            throw new DelayedError();
                        }
                        break;
                    case CheckSteps.BACKUP:
                        try {
                            await warn(job.data.userId, true)
                        } catch (e) {
                            if (e instanceof UserDeleted) {
                                // stop the job as user is deleted
                                return
                            } else {
                                throw e; // re-throw the error unchanged
                            }
                        }
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

            new Worker(STANDARD_QUEUE, async (job, token?: string) => {
                switch (job.name) {
                    case STANDARD_QUEUE_JOBS.REPEATING_NOTIFIER:
                        // TODO switch for different repeating notifier implementations
                        const notifier = new WarningNotifier(job.data.notifier.userId, job.data.notifier.guardType, job.data.notifier.nextRequiredCheckIn, toConcreteNotification(job.data.notifier.notification), job.data.notifier.currentRound)
                        await notifier.submit()
                        if(notifier.shouldReschedule()) {
                            await job.moveToDelayed(Date.now() + 1000 * notifier.getRescheduleDelayInSeconds(), token);
                            await job.updateData({
                                notifier: notifier
                            });
                            throw new DelayedError();
                        }
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
    }



};

