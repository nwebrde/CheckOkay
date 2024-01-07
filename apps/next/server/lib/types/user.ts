import Check from './check'
import Guard, { Guarded } from './gaurd'
import { CheckState } from 'app/lib/types/checks'

export default interface User {
    id: string
    name?: string
    email: string
    emailVerified: boolean
    image?: string

    state: CheckState
    step?: boolean
    lastCheckOkay?: Date
    nextRequiredCheckDate?: Date
    checks?: Check[]
    guards?: Guard[]
    guardedUsers?: Guarded[]
}
