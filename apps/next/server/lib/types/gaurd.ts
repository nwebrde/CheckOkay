import User from "./user";

export default interface Guard {
    priority: GuardType,
    since: Date,
    guardUser: User
}

export enum GuardType {
    IMPORTANT = "important",
    BACKUP = "backup"
}