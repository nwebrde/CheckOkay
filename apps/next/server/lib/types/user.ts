import Check from './check'
import Guard, { Guarded } from './guard'
import { CheckState } from 'app/lib/types/check'
import UserProfile from 'app/lib/types/userProfile'

export default interface User extends UserProfile {
    emailVerified: boolean
    state: CheckState
    step?: boolean
    lastCheckOkay?: Date
    nextRequiredCheckDate?: Date
    checks?: Check[]
    guards?: Guard[]
    guardedUsers?: Guarded[]
}
