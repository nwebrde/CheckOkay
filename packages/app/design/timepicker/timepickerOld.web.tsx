import React, { useRef, useEffect, useState, useCallback } from 'react'
import { TimepickerUI } from 'timepicker-ui'
import './style.css'
import { Props } from 'app/design/timepicker/timepicker'
import { P, Text } from 'app/design/typography'
import { View } from 'app/design/view'
import { localToUTC, UTCToLocal } from 'app/lib/time'

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

export function TimePicker(props: Props) {
    const tmRef = useRef(null)
    const [inputValue, setInputValue] = useState<string>()

    useEffect(() => {
        if (props.displayTimeInLocalFormat) {
            const local = UTCToLocal(props.hour, props.minute)
            setInputValue(toString(local.hour, local.minute))
        } else {
            setInputValue(toString(props.hour, props.minute))
        }
    }, [props])

    const testHandler = useCallback(
        ({ detail: { hour, minutes, type } }) => {
            setInputValue(`${hour}:${minutes} ${type}`)
            if (props.displayTimeInLocalFormat) {
                const utc = localToUTC(Number(hour), Number(minutes))
                props.onChange(utc.hour, utc.minute)
            } else {
                props.onChange(Number(hour), Number(minutes))
            }
        },
        [props],
    )

    useEffect(() => {
        const tm = tmRef.current

        const newPicker = new TimepickerUI(tm!, {
            mobile: true,
            theme: 'm3',
            clockType: '24h',
            enableScrollbar: true,
            mobileTimeLabel: 'Gebe eine Zeit ein',
            hourMobileLabel: 'Stunde',
            minuteMobileLabel: 'Minute',
            cancelLabel: 'Undo',
        })
        newPicker.create()

        // @ts-ignore
        tm.addEventListener('accept', testHandler)

        return () => {
            // @ts-ignore
            tm.removeEventListener('accept', testHandler)
        }
    }, [testHandler])

    return (
        <View className="flex-row items-center text-lg">
            <div className="timepicker-ui" ref={tmRef}>
                <input
                    type="test"
                    className="timepicker-ui-input"
                    defaultValue={inputValue!}
                />
            </div>
            {props.unit && <Text className="text-lg">{props.unit}</Text>}
        </View>
    )
}
