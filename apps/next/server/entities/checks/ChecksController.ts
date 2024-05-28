import {Check} from "./Check";
import {Hour, Minute} from "app/lib/types/time";

export class ChecksController {
    checks: Check[] // sorted ascending

    constructor(checks: Check[]) {
        this.checks = checks;
        this.checks.sort((checkA, checkB) => checkA.isBefore(checkB.hour, checkB.minute) ? -1 : 1)
    }

    /**
     * Returns the check and time the guarded user must checkIn if the last check in happend at lastCheckIn
     * @param lastCheckIn last check in time. Current time is used if parameter is omitted
     */
    getNextRequiredCheck(lastCheckIn: Date = new Date()) {
        return this.getNextCheck(this.getNextCheck(lastCheckIn)?.date)
    }


    /**
     * @param date returns the UTC date of the next check according to date. if undefined, the next check according to current time will be returned.
     * returns:
     * UTC date of the next upcoming check-in time
     * undefined - if no checks are set
     */
    getNextCheck(date?: Date) {
        if (this.checks.length <= 0) {
            return undefined
        }

        let currDate = date ?? new Date()

        let nextCheck = this.checks[0]
        let nextDay = true

        for (const check of this.checks) {
            if(check.isAfter(<Hour>currDate.getUTCHours(), <Minute>currDate.getUTCMinutes())) {
                nextCheck = check
                nextDay = false
                break
            }
        }

        return {
            check: nextCheck,
            date: nextCheck.toUTCDate(nextDay ? 1 : 0, date)
        }
    }

    /**
     *
     * @param date
     * returns:
     * UTC date of the check-in time previous to date (current time if date is omitted)
     * undefined - if no checks are set
     */
    getPreviousCheck(date?: Date) {
        const checks = this.checks;
        checks.reverse();

        if (!checks || checks.length <= 0) {
            return undefined
        }

        let currDate = date ?? new Date()

        let previousCheck = checks[0]
        let previousDay = true
        for (const check of checks) {
            if(check.isBefore(<Hour>currDate.getUTCHours(), <Minute>currDate.getUTCMinutes())) {
                previousCheck = check
                previousDay = false
                break
            }
        }

        return {
            check: previousCheck,
            date: previousCheck?.toUTCDate(previousDay ? -1 : 0, date)
        }
    }
}