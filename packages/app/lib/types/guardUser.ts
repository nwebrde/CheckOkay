import type UserProfile from "app/lib/types/userProfile";

export interface Guard {
    priority: GuardType
    since: Date
    guardUser: UserProfile
}

export enum GuardType {
    IMPORTANT = 'important',
    BACKUP = 'backup',
}
