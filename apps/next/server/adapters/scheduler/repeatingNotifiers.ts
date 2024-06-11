import { queue, STANDARD_QUEUE_JOBS } from './config'
import { RepeatingNotifier } from '../../controllers/notifications/ConcreteNotifiers'



/**
 *
 * @param notifier
 * @param delay in seconds
 */
export const repeat = async (notifier: RepeatingNotifier, delay: number = 0) => {
    await queue.add(STANDARD_QUEUE_JOBS.REPEATING_NOTIFIER, {
        notifier: notifier
    }, {
        delay: delay * 1000,
        attempts: 18, // spans in sum three months
        backoff: {
            type: 'exponential',
            delay: 30000, // half minute
        }});
}