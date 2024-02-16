export interface Check {
    hour: number // 0 - 23
    minute: number // 0 - 59
    checkId: string
}

export enum CheckState {
    OK = 'OK', // else
    NOTIFIED = 'NOTIFIED', // if not responded to a check notification, but check time not exceeded yet
    WARNED = 'WARNED', // if check time is exceeded
    BACKUP = 'BACKUP',
}