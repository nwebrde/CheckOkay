import {CheckState} from "app/lib/types/check";
import {GuardType} from "app/lib/types/guardUser";
import UserProfile from "app/lib/types/userProfile";

export default interface GuardedUser {
    since: Date
    priority: GuardType
    guardedUser: UserProfile
    state: CheckState
    lastCheckOkay?: Date
    step?: boolean
    nextRequiredCheckDate?: Date
}


