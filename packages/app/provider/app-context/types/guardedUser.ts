import UserProfile from 'app/provider/app-context/types/userProfile'
import { GuardType } from 'app/provider/app-context/types/guardUser'

export default interface GuardedUser {
    since: string
    priority: GuardType
    guardedUser: UserProfile
    state: CheckState
    lastCheckOkay?: string
    step?: boolean
    nextOpenCheck?: string
}

export enum CheckState {
    OK = 'OK', // else
    NOTIFIED = 'NOTIFIED', // if not responded to a check notification, but check time not exceeded yet
    WARNED = 'WARNED', // if check time is exceeded
    BACKUP = 'BACKUP',
}
