const initOptions: RequestInit = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.SCHEDULER_API_KEY!,
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
}

async function createEvent(
    hour: number,
    minute: number,
    title: string,
    category: string,
    url: string,
    headers: string,
    data: string,
    successMatch: string,
    errorMatch: string,
): Promise<string | undefined> {
    const endpoint = process.env.SCHEDULER_URL! + '/api/app/create_event/v1'
    const result = await fetch(endpoint, {
        ...initOptions,
        body: JSON.stringify({
            title: title,
            enabled: 1,
            category: category,
            plugin: 'urlplug',
            params: {
                method: 'POST',
                url: url,
                headers: headers, // one per line
                data: data, // raw post data
                timeout: 30, // seconds
                success_match: successMatch, // regex which is matched against the response body
                error_match: errorMatch, // regex which is matched against the response body
            },
            target: 'allgrp',
            retries: 5,
            retry_delay: 30,
            timeout: 3600, // in seconds. 0 to run infinitely
            timezone: 'Etc/UTC',
            timing: {
                hours: [hour],
                minute: [minute],
            },
            algo: 'round_robin',
            catch_up: true, // ensures that all jobs of this event run, even if late
            max_children: 1, // number of jobs of this event that can run simultaneous
            queue: true,
            queue_max: 5,
        }),
    })
    const response = await result.json()
    if (response.has('code') && response.code == 0) {
        return response.id
    } else {
        return undefined
    }
}

export async function createCheckEvent(hour: number, minute: number) {
    return createEvent(
        hour,
        minute,
        'check event',
        'clql2okdx02',
        '',
        '',
        '',
        '',
        '',
    )
}

export async function createNotificationEvent(hour: number, minute: number) {
    return createEvent(
        hour,
        minute,
        'notification event',
        'clql2p08i03',
        '',
        '',
        '',
        '',
        '',
    )
}

export async function updateEventTiming(
    eventId: string,
    hour: number,
    minute: number,
): Promise<boolean> {
    const url = process.env.SCHEDULER_URL! + '/api/app/update_event/v1'
    const result = await fetch(url, {
        ...initOptions,
        body: JSON.stringify({
            id: eventId,
            timing: {
                hours: [hour],
                minute: [minute],
            },
        }),
    })
    const response = await result.json()
    if (response.has('code') && response.code == 0) {
        return true
    } else {
        return false
    }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
    const url = process.env.SCHEDULER_URL! + '/api/app/delete_event/v1'
    const result = await fetch(url, {
        ...initOptions,
        body: JSON.stringify({
            id: eventId,
        }),
    })
    const response = await result.json()
    if (response.has('code') && response.code == 0) {
        return true
    } else {
        return false
    }
}
