import {queue} from "./config";
import { RepeatingNotifier } from '../../controllers/notifications/ConcreteNotifiers'

export enum STANDARD_QUEUE_JOBS {
    REPEATING_NOTIFIER = "REPEATING_NOTIFIER"
}

/**
 *
 * @param notifier
 * @param delay in seconds
 */
export const repeat = async (notifier: RepeatingNotifier, delay: number = 0) => {
    await queue.add(STANDARD_QUEUE_JOBS.REPEATING_NOTIFIER, {
        notifier: notifier
    }, { delay: delay * 1000 });
}