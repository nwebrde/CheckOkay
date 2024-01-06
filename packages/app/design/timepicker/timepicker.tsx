import { useCallback, useEffect, useState } from 'react'
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { StyleProp, ViewStyle } from 'react-native'
import { View } from 'app/design/view'
import { P } from 'app/design/typography'
import { localToUTC, UTCToLocal } from 'app/lib/time'

export type Props = {
    hour: number // in UTC format
    minute: number // in UTC format
    displayTimeInLocalFormat?: boolean // false default
    onChange: (hour: number, minute: number) => void // hour and minute in UTC format
    unit?: string
    style?: StyleProp<ViewStyle>
}

export const TimePicker = ({
    hour,
    minute,
    displayTimeInLocalFormat,
    onChange,
    unit,
    style,
}: Props) => {
    const [time, setTime] = useState<Date>(new Date())

    useEffect(() => {
        if (displayTimeInLocalFormat) {
            setTime(UTCToLocal(hour, minute).date!)
        } else {
            const date = new Date()
            date.setMinutes(minute)
            date.setHours(hour)
            setTime(date)
        }
    }, [hour, minute, displayTimeInLocalFormat])

    const change = useCallback(
        (event: DateTimePickerEvent, selectedTime?: Date) => {
            if (selectedTime) {
                setTime(selectedTime)
                if (displayTimeInLocalFormat) {
                    const utc = localToUTC(
                        selectedTime.getHours(),
                        selectedTime.getMinutes(),
                    )
                    onChange(utc.hour, utc.minute)
                } else {
                    onChange(selectedTime.getHours(), selectedTime.getMinutes())
                }
            }
        },
        [onChange, displayTimeInLocalFormat],
    )

    return (
        <View className="flex-row">
            <DateTimePicker
                style={style}
                value={time!}
                mode="time"
                is24Hour={true}
                onChange={change}
            />
            <P> {unit}</P>
        </View>
    )
}
