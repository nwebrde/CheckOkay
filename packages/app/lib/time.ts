import moment from 'moment'
import 'moment/locale/de'

export type Time = {
    hour: number
    minute: number
    date?: Date
}

export function localToUTC(hour: number, minute: number): Time {
    const date = new Date()
    date.setHours(hour)
    date.setMinutes(minute)
    return {
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        date: date,
    }
}

export function UTCToLocal(hour: number, minute: number): Time {
    const date = new Date()
    date.setUTCHours(hour)
    date.setUTCMinutes(minute)
    return {
        hour: date.getHours(),
        minute: date.getMinutes(),
        date: date,
    }
}

export const localMoment = moment()
