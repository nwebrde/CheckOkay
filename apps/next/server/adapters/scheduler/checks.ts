import {checkQueue, CheckSteps} from "./config";

const STRINGIFIER = "_string";


/**
 * Adds new jobs to the checkQueue in BullMQ
 * If a job with checkId already exists, this call is ignored
 * @param time UTC time of the next check run
 * @param userId
 * @param checkId
 * @param reminder time in seconds before the check time to notify guarded person about pending checkIn
 * @param backup time in seconds after the check time to warn backup guards
 */
export const addCheck = async (userId: string, checkId: number, time: Date, checkInPossibleFrom: Date | undefined, reminder: number, backup: number) => {

    const {delay, skipReminder} = getReminderDelay(time, reminder, checkInPossibleFrom, false)

    const backupTime = new Date(time)
    backupTime.setUTCSeconds(backup)

    const res = await checkQueue.add('check', {
        step: CheckSteps.REMINDER,
        firstReminderSent: skipReminder,
        lastResortCheckIn: false,
        checkDate: time,
        backupDate: backup > 0 ? backupTime : undefined,
        userId: userId
    }, {
        jobId: checkId.toString() + STRINGIFIER,
        delay: delay
    });

    return res != null
}

export const deleteCheck = async (checkId: number) => {
    return (await checkQueue.remove(checkId.toString() + STRINGIFIER) == 1);
}

/**
 * Updates a check currently in the queue.
 * Returns false if a corresponding check is not in the queue. Returns true otherwise.
 * @param checkId
 * @param checkDate if omitted, the old values are used
 * @param reminder if omitted, the old values are used
 * @param backup if omitted, the old values are used
 */
export const updateCheck = async (checkId: number, checkDate: Date, checkInPossibleFrom: Date | undefined, reminder: number, backup: number) => {
    const job = await checkQueue.getJob(checkId.toString() + STRINGIFIER)
    if(!job) {
        return false
    }

    const state = await job.getState();
    if(state == "completed" || state == "failed" || state == "unknown" || state == "active") {
        return false
    }

    let delay = 0;

    let backupTime = new Date(checkDate)
    backupTime.setUTCSeconds(backup)

    switch (job.data.step) {
        case CheckSteps.REMINDER:

            const reminderDelay = getReminderDelay(checkDate, reminder, checkInPossibleFrom, job.data.lastResortCheckIn)
            const skipReminder = reminderDelay.skipReminder
            delay = reminderDelay.delay

            await job.updateData({
                step: CheckSteps.REMINDER,
                firstReminderSent: job.data.firstReminderSent || skipReminder,
                lastResortCheckIn: job.data.lastResortCheckIn,
                checkDate: checkDate,
                backupDate: backup > 0 ? backupTime : undefined,
                userId: job.data.userId
            })

            await job.changeDelay(delay)
            break

        case CheckSteps.CHECK:
            delay = (Number(checkDate) - Number(new Date()))
            if(delay < 0) {
                delay = 0
            }

            await job.updateData({
                step: job.data.step,
                firstReminderSent: job.data.firstReminderSent,
                lastResortCheckIn: job.data.lastResortCheckIn,
                checkDate: checkDate,
                backupDate: backup > 0 ? backupTime : undefined,
                userId: job.data.userId
            })

            await job.changeDelay(delay)
            break

        case CheckSteps.BACKUP:
            if(!job.finishedOn) {
                // completed / failed jobs do not have their delay changed
                delay = (Number(backupTime) - Number(new Date()))
                if(delay < 0) {
                    delay = 0
                }

                await job.changeDelay(delay)
            }

            break
    }

    return true
}

/**
 * Returns true if reminder time was updated
 * Returns false if reminder time was not updated
 * @param checkId
 * @param reminder seconds
 */
export const updateReminderTime = async (checkId: number, reminder: number, checkInPossibleFrom: Date | undefined) => {
    const job = await checkQueue.getJob(checkId.toString() + STRINGIFIER)
    if(!job || job.data.step != CheckSteps.REMINDER || job.data.firstReminderSent) {
        return false
    }

    const {delay, skipReminder} = getReminderDelay(new Date(job.data.checkDate), reminder, checkInPossibleFrom, job.data.lastResortCheckIn)

    await job.updateData({
        step: CheckSteps.REMINDER,
        firstReminderSent: job.data.firstReminderSent || skipReminder,
        lastResortCheckIn: job.data.lastResortCheckIn,
        checkDate: job.data.checkDate,
        backupDate: job.data.backupDate,
        userId: job.data.userId
    })
    await job.changeDelay(delay)
    return true
}

/**
 * Returns true if backup time was updated
 * Returns false if backup time was not updated
 * @param checkId
 * @param backup seconds
 */
export const updateBackupTime = async (checkId: number, backup: number) => {
    const job = await checkQueue.getJob(checkId.toString() + STRINGIFIER)
    if(!job) {
        return false
    }

    let delay = 0;

    let backupTime = new Date(job.data.checkDate)
    backupTime.setUTCSeconds(backup)

    switch (job.data.step) {
        case CheckSteps.REMINDER:
        case CheckSteps.CHECK:

                await job.updateData({
                    step: job.data.step,
                    firstReminderSent: job.data.firstReminderSent,
                    lastResortCheckIn: job.data.lastResortCheckIn,
                    checkDate: job.data.checkDate,
                    backupDate: backupTime,
                    userId: job.data.userId
                })

            break;
        case CheckSteps.BACKUP:
            if(!job.finishedOn) {
                // completed / failed jobs do not have their delay changed

                delay = Number(backupTime) - Number(new Date())
                if(delay < 0) {
                    delay = 0
                }

                await job.updateData({
                    step: job.data.step,
                    firstReminderSent: job.data.firstReminderSent,
                    lastResortCheckIn: job.data.lastResortCheckIn,
                    checkDate: job.data.checkDate,
                    backupDate: backupTime,
                    userId: job.data.userId
                })

                await job.changeDelay(delay)
            }

            break;
    }

    return true
}


const getReminderDelay = (checkDate: Date, reminder: number, checkInPossibleFrom: Date | undefined, lastResortCheckInDone: boolean) => {
    let reminderDelay = (Number(checkDate) - Number(new Date())) - reminder * 1000;
    let criticalDelay = (Number(checkDate) - Number(new Date())) - 5 * 60 * 1000;

    let skipReminder = false

    if(checkInPossibleFrom) {
        const reminderOffset = Number(checkInPossibleFrom) - (Number(new Date()) + reminderDelay)
        if(reminderOffset > 0) {
            reminderDelay = reminderDelay + reminderOffset
        }

        const criticalOffset = Number(checkInPossibleFrom) - (Number(new Date()) + criticalDelay)
        if(criticalOffset > 0) {
            criticalDelay = reminderDelay + criticalOffset
        }
    }

    if(reminderDelay <= 0 && criticalDelay <= 0) {
        skipReminder = true;
    }

    let delay = reminderDelay;

    if(!lastResortCheckInDone) {
        delay = delay - 2 * 60 * 1000;
    }
    else if(skipReminder) {
        delay = criticalDelay
    }

    if(delay < 0) {
        delay = 0
    }

    return {
        skipReminder: skipReminder,
        delay: delay
    }
}



