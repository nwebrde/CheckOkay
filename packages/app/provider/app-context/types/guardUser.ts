import UserProfile from 'app/provider/app-context/types/userProfile'

export default interface Guard {
    priority: GuardType
    since: string
    guardUser: UserProfile
}

export enum GuardType {
    IMPORTANT = 'important',
    BACKUP = 'backup',
}
