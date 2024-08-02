import { queue, STANDARD_QUEUE_JOBS } from './config'
import {
    RepeatingNotifier,
    WARNING_NOTIFIER_JOB_ID_BACKUP,
    WARNING_NOTIFIER_JOB_ID_NORMAL
} from '../../controllers/notifications/ConcreteNotifiers'



/**
 *
 * @param notifier
 * @param delay in seconds
 */
export const repeat = async (notifier: RepeatingNotifier, jobId: string, delay: number = 0) => {
    await queue.add(STANDARD_QUEUE_JOBS.REPEATING_NOTIFIER, {
        notifier: notifier
    }, {
        jobId: jobId,
        delay: delay * 1000,
        attempts: 18, // spans in sum three months
        backoff: {
            type: 'exponential',
            delay: 30000, // half minute
        }});
}

export const deleteRepeatingNotifier = async (userId: string) => {
    await queue.remove(userId + WARNING_NOTIFIER_JOB_ID_BACKUP)
    await queue.remove(userId + WARNING_NOTIFIER_JOB_ID_NORMAL)
}