import UserProfile from 'app/provider/app-context/types/userProfile'

export default interface GuardUser {
  priority: GuardType
  since: Date
  profile: UserProfile
}

export enum GuardType {
  IMPORTANT = 'important',
  BACKUP = 'backup',
}
