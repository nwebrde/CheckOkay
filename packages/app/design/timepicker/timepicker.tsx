import { TimerPicker } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient"; // or `import LinearGradient from "react-native-linear-gradient"`
import * as Haptics from "expo-haptics";
import { StyleProp, ViewStyle } from 'react-native'
import { localToUTC, UTCToLocal } from 'app/lib/time'

type Props = {
    hour: number // in UTC format
    minute: number // in UTC format
    displayTimeInLocalFormat?: boolean // false default
    onChange: (hour: number, minute: number) => void // hour and minute in UTC format
    unit?: string
    style?: StyleProp<ViewStyle>
}
export function TimePicker({hour, minute, displayTimeInLocalFormat, onChange, unit}: Props) {
    const change = (hour, minute) => {
        if(displayTimeInLocalFormat) {
            const utc = localToUTC(hour, minute)
            onChange(utc.hour, utc.minute)
        }
        else {
            onChange(hour, minute)
        }
    }
    return (
            <TimerPicker
                padWithNItems={2}
                hideSeconds
                minuteLabel="min"
                hourLabel="h"
                onDurationChange={({hours, minutes}) => {change(hours, minutes)}}
                initialValue={{
                    hours: displayTimeInLocalFormat ? UTCToLocal(hour, minute).hour : hour,
                    minutes: displayTimeInLocalFormat ? UTCToLocal(hour, minute).minute : minute
                }}
                Haptics={Haptics}
                LinearGradient={LinearGradient}
                styles={{
                    theme: "light",
                    backgroundColor: "#ffffff",
                    pickerItem: {
                        fontSize: 34,
                    },
                    pickerLabel: {
                        fontSize: 26,
                        fontWeight: "500",
                        right: -20,
                        color: "#c9ba97"
                    },
                    pickerLabelContainer: {
                        width: 60,
                    },
                    pickerItemContainer: {
                        width: 150,
                    },
                }}
            />
    )
}
