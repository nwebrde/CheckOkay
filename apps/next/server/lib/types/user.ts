import Check from "./check";
import Guard from "./gaurd";

export default interface User {
    id: string,
    name?: string,
    email: string,
    emailVerified: boolean,
    image?: string,
    lastManualCheck?: Date,
    lastStepCheck?: Date,
    checks?: Check[],
    guards?: Guard[]
}