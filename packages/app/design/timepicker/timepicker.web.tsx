import React, { useRef, useEffect, useState, useCallback } from 'react'
import { TimepickerUI } from 'timepicker-ui'
import './style.css'
import { Props } from 'app/design/timepicker/timepicker'

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
    const [inputValue, setInputValue] = useState(
        toString(props.hour, props.minute),
    )

    useEffect(() => {
        setInputValue(toString(props.hour, props.minute))
    }, [props])

    const testHandler = useCallback(({ detail: { hour, minutes, type } }) => {
        setInputValue(`${hour}:${minutes} ${type}`)
        props.onChange(Number(hour), Number(minutes))
    }, [])

    useEffect(() => {
        const tm = tmRef.current

        const newPicker = new TimepickerUI(tm!, {
            mobile: true,
            theme: 'm3',
            clockType: '24h',
            enableScrollbar: true,
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
        <div className="timepicker-ui" ref={tmRef}>
            <input
                type="test"
                className="timepicker-ui-input"
                defaultValue={inputValue}
            />
        </div>
    )
}
