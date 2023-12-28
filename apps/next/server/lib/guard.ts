import Guard from "./types/gaurd";
import {toUser} from "./user";
import type {guards} from "db/schema/guards";
import type {users} from "db/schema/auth";

type GuardDB = typeof guards.$inferSelect
type UserDB = typeof users.$inferSelect
type GuardWithGuardUserDB = GuardDB&{
    guardUser: UserDB
}

/**
 * Converts a DB object to corresponding lib type
 * @param guard
 */
export function toGuard(guard: GuardWithGuardUserDB): Guard {
    return {
        priority: guard.priority,
        since: guard.createdAt,
        guardUser: toUser(guard.guardUser)
    }
}
export function toGuards(guards: GuardWithGuardUserDB[]): Guard[] {
    const results: Guard[] = [];
    for (const guard of guards) {
        results.push(toGuard(guard))
    }
    return results;
}