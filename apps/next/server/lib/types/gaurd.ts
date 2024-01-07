import User from './user'
import { CheckState } from 'app/lib/types/checks'

export default interface Guard {
    priority: GuardType
    since: Date
    guardUser: User
}

export interface Guarded {
    priority: GuardType
    since: Date
    guardedUser: User
    state: CheckState
    step?: boolean
    lastCheckOkay?: Date
    nextOpenCheck?: Date
}

export enum GuardType {
    IMPORTANT = 'important',
    BACKUP = 'backup',
}
