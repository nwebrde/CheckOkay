import { useEffect, useState } from 'react'
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { StyleProp, ViewStyle } from 'react-native'

export type Props = {
    hour: number
    minute: number
    onChange: (hour: number, minute: number) => void
    style?: StyleProp<ViewStyle>
}

export const TimePicker = (props: Props) => {
    const initTime = new Date(2023, 12, 12, props.hour, props.minute)
    const [time, setTime] = useState(initTime)

    useEffect(() => {
        setTime(new Date(2023, 12, 12, props.hour, props.minute))
    }, [props])

    const onChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
        if (selectedTime) {
            setTime(selectedTime)
            props.onChange(selectedTime.getHours(), selectedTime.getMinutes())
        }
    }

    return (
        <DateTimePicker
            style={props.style}
            value={time}
            mode="time"
            is24Hour={true}
            onChange={onChange}
        />
    )
}
