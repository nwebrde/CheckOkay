import {Hour, Minute} from "app/lib/types/time";


export class Check {
    hour: Hour // 0 - 23
    minute: Minute // 0 - 59
    id: number

    constructor(hour: Hour, minute: Minute, id: number) {
        this.hour = hour;
        this.minute = minute;
        this.id = id;
    }

    /**
     * Returns true if this check is after or equal the provided hour and minute
     */
    isAfter(hour: Hour, minute: Minute): boolean {
        if (this.hour > hour) {
            return true
        } else if (
            this.hour == hour &&
            this.minute > minute
        ) {
            return true
        }

        return false
    }

    /**
     * Returns true if this check is before or equal to the provided hour and minute
     */
    isBefore(hour: Hour, minute: Minute): boolean {
        if (this.hour < hour) {
            return true
        } else if (
            this.hour == hour &&
            this.minute < minute
        ) {
            return true
        }

        return false
    }

    /**
     * Converts check to a UTC datetime object with current day, month and year
     * @param dayOffset
     */
    toUTCDate(dayOffset: number = 0, referenceDate: Date = new Date()) {
        let date = new Date(referenceDate)
        date.setUTCHours(this.hour)
        date.setUTCMinutes(this.minute)
        date.setUTCMilliseconds(0)
        date.setUTCSeconds(0)

        date = new Date(date.getTime() + dayOffset * 86400000)

        return date
    }
}