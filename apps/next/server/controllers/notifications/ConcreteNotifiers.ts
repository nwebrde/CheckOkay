import {db} from "db";
import {eq} from "drizzle-orm";
import {users} from "db/schema/auth";
import {Notifier} from "../../entities/notifications/Notifier";
import {Notification, Recipient} from "../../entities/notifications/Notifications"
import {NotificationSubmitter} from "../../entities/notifications/NotificationSubmitter";
import {repeat} from "../../adapters/scheduler/repeatingNotifiers";
import { getAllSubmitters } from './NotificationSubmitters'
import { GuardType } from 'app/lib/types/guardUser'

/**
 * Sends notification only once to all provided NotificationSubmitters.
 * The notification is not refreshed when it is send (as this is assumed to happen directly)
 */
export class StandardNotifier extends Notifier {
    protected submitters: NotificationSubmitter[]

    constructor(notification: Notification, submitters: NotificationSubmitter[]) {
        super(notification);
        this.submitters = submitters;
    }

    async submit() {
        for (const submitter of this.submitters) {
            await submitter.submit(this.notification)
        }
    }
}

/**
 * Sends notification multiple times to all proivded NotificationSubmitters.
 * On each repetition, the notification is refreshed (e.g. checked if it is expired and if so, the repetition ends)
 */
export abstract class RepeatingNotifier extends Notifier {
    private currentRound: number
    private readonly repeatTimes: number
    private readonly repeatInterval: number // minutes
    private readonly multiplicativeBackoffFactor: number

    /**
     *
     * @param notification
     * @param repeatTimes
     * @param repeatInterval
     * @param multiplicativeBackoffFactor no exponential backoff for value 1. Binary exponential backoff for value 2
     * @param currentRound
     */
    protected constructor(notification: Notification, repeatTimes: number = 2, repeatInterval: number = 60, multiplicativeBackoffFactor: number = 1, currentRound: number = 1) {
        super(notification);
        this.repeatTimes = repeatTimes;
        this.repeatInterval = repeatInterval;
        this.currentRound = currentRound;
        this.multiplicativeBackoffFactor = multiplicativeBackoffFactor;
    }

    async submit() {
        if (this.repeatTimes > 1 && !await this.notification.refresh()) {
            return;
        }

        const notifier = new StandardNotifier(this.notification, await this.getSubmitters())
        await notifier.submit();

        if (this.currentRound <= this.repeatTimes) {
            this.currentRound++;
            await repeat(this, this.repeatInterval * 60 * Math.pow(this.multiplicativeBackoffFactor, this.currentRound - 2))
        }
    }

    // concrete implementation contains logic for retrieving the submitters
    protected abstract getSubmitters(): Promise<NotificationSubmitter[]>
}

/**
 * Submits a notification for all notification channels for all guards of user with id userId.
 * Repeats this behaviour 9 times with a binary exponential backoff (with 0,5h factor) => last notification 10,5 days after submit.
 * 
 * stops the repetition automatically if the user checked in again.
 */
export class WarningNotifier extends RepeatingNotifier {
    userId: string
    guardType: GuardType

    constructor(userId: string, guardType: GuardType, notification: Notification, currentRound = 1) {
        super(notification, 10, 30, 2, currentRound);
        this.userId = userId;
        this.guardType = guardType
    }

    protected async getSubmitters(): Promise<NotificationSubmitter[]> {
        const data = await db.query.users.findFirst({
            where: eq(users.id, this.userId),
            with: {
                guards: {
                    with: {
                        guardUser: {
                            with: {
                                notificationChannels: true
                            }
                        }
                    }
                }
            }
        })

        if(!data) {
            return []
        }

        const submitters: NotificationSubmitter[] = []

        for (const guard of data?.guards) {
            if(guard.priority == this.guardType) {
                const recipient: Recipient = {
                    name: guard.guardUser.name!
                }

                submitters.push(...await getAllSubmitters(recipient, undefined, guard.guardUser.email, guard.guardUser.notificationChannels))
            }
        }

        return submitters
    }
}