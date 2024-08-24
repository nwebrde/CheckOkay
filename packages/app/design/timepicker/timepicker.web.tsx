import { useCallback, useEffect, useRef, useState } from 'react'

import { View } from 'app/design/view'
import { P, Text } from 'app/design/typography'
import { localToUTC, UTCToLocal } from 'app/lib/time'
import 'react-time-picker/dist/TimePicker.css'
import './style.css'
import { Props } from 'app/design/timepicker/timepickerOld'

import { TimePicker as TimePickerComponent } from 'react-time-picker'

function addLeadingZero(number: number): string {
    if (number <= 9) {
        return '0' + number
    } else {
        return number.toString()
    }
}

function toString(hour: number, minute: number): string {
    return addLeadingZero(hour) + ':' + addLeadingZero(minute)
}

let valueF

export const TimePicker = ({
    onChange,
    hour,
    minute,
    minMinutes = 0,
    displayTimeInLocalFormat,
    unit,
}: Props) => {
    const tmRef = useRef(null)
    const [inputValue, setInputValue] = useState<string>()

    useEffect(() => {
        if (displayTimeInLocalFormat) {
            const local = UTCToLocal(hour, minute)
            setInputValue(toString(local.hour, local.minute))
        } else {
            setInputValue(toString(hour, minute))
        }
    }, [hour, minute, displayTimeInLocalFormat])

    const changeHandler = useCallback(() => {
        if (valueF) {
            console.log(valueF)
            const time = valueF.split(':')
            if (displayTimeInLocalFormat) {
                const utc = localToUTC(Number(time[0]), Number(time[1]))
                onChange(utc.hour, utc.minute)
            } else {
                onChange(Number(time[0]), Number(time[1]))
            }
        }
    }, [onChange, displayTimeInLocalFormat])

    const today = new Date();

    return (
        <View className="flex-row">
            <TimePickerComponent
                className="timepicker-ui-input"
                disableClock
                minTime={displayTimeInLocalFormat ? undefined : new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, minMinutes, 0).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                clearIcon={<></>}
                onBlur={changeHandler}
                onChange={(value: string) => {
                    setInputValue(value)
                    valueF = value
                }}
                value={inputValue}
            />
            <P> {unit}</P>
        </View>
    )
}
