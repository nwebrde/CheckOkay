import User from './user'
import GuardedUser from "app/lib/types/guardedUser";
import {Guard as GuardUser} from "app/lib/types/guardUser";

export default interface Guard extends GuardUser {
    guardUser: User
}

export interface Guarded extends GuardedUser {
    guardedUser: User
}
