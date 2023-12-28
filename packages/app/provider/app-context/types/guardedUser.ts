import UserProfile from 'app/provider/app-context/types/userProfile'

export default interface GuardedUser {
  since: Date
  profile: UserProfile
  lastManualCheck?: Date
  lastStepCheck?: Date
  state: ChecksState
}

export enum ChecksState {
  OK, // else
  UNKNOWN, // if not responded to a check notification, but check time not exceeded yet
  DANGER, // if check time is exceeded
}
