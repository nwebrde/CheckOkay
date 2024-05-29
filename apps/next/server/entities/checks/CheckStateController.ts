import {CheckState} from "app/lib/types/check";

export class CheckStateController {
    constructor(nextCheckInRequiredAt: Date, reminderBeforeCheck: number, notifyBackupGuards: number, state: CheckState) {
        this.nextCheckInRequiredAt = new Date(nextCheckInRequiredAt);
        this.reminderBeforeCheck = reminderBeforeCheck;
        this.notifyBackupGuards = notifyBackupGuards;
        this.state = state;
    }

    nextCheckInRequiredAt: Date

    reminderBeforeCheck: number // seconds
    notifyBackupGuards: number // seconds

    state: CheckState

    needsReminder() {
        if (this.state != CheckState.OK || (new Date()).getTime() < this.getReminderTime().getTime()) {
            return false
        }
        return true
    }

    needsWarning() {
        if(this.state == CheckState.BACKUP || this.state == CheckState.WARNED || (new Date()).getTime() < this.nextCheckInRequiredAt.getTime()) {
            return false
        }

        return true
    }

    needsBackupWarning() {
        if (this.state != CheckState.WARNED || (new Date()).getTime() < this.getTimeToWarnBackupGuards().getTime()) {
            return false
        }

        return true
    }

    getReminderTime() {
        const date = this.nextCheckInRequiredAt
        date.setUTCSeconds(date.getUTCSeconds() - this.reminderBeforeCheck)
        return date
    }

    getTimeToWarnBackupGuards() {
        const date = this.nextCheckInRequiredAt
        date.setUTCSeconds(date.getUTCSeconds() + this.notifyBackupGuards)
        return date
    }
}