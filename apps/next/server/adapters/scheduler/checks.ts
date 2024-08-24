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
export const addCheck = async (userId: string, checkId: number, time: Date, reminder: number, backup: number) => {
    let delay = (Number(time) - Number(new Date())) - 60 * 5 * 1000;

    if(reminder > 0) {
        delay = (Number(time) - Number(new Date())) - reminder * 1000;
    }

    if(delay < 0) {
        delay = 0
    }

    const backupTime = new Date(time)
    backupTime.setUTCSeconds(backup)

    const res = await checkQueue.add('check', {
        step: CheckSteps.REMINDER,
        firstReminderSent: reminder <= 0,
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
export const updateCheck = async (checkId: number, checkDate: Date, reminder: number, backup: number) => {
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

            delay = (Number(checkDate) - Number(new Date())) - 60 * 5 * 1000;
            if(!job.data.firstReminderSent) {
                delay = (Number(checkDate) - Number(new Date())) - reminder * 1000;
            }

            if(delay < 0) {
                delay = 0
            }

            await job.updateData({
                step: CheckSteps.REMINDER,
                firstReminderSent: reminder <= 0 || job.data.firstReminderSent,
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
export const updateReminderTime = async (checkId: number, reminder: number) => {
    const job = await checkQueue.getJob(checkId.toString() + STRINGIFIER)
    if(!job || job.data.step != CheckSteps.REMINDER || job.data.firstReminderSent) {
        return false
    }

    let delay = (Number(new Date(job.data.checkDate)) - Number(new Date())) - reminder * 1000;
    if(delay < 0) {
        delay = 0
    }

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



