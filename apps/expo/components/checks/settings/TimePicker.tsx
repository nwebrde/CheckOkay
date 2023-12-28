import {useState} from "react";
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {Props} from "../../../lib/types";

export const TimePicker = (props: Props) => {
    const [time, setTime] = useState(new Date());

    const onChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
        if(selectedTime) {
            setTime(selectedTime)
        }
    };

    return (
                <DateTimePicker
                    style={props.style}
                    value={time}
                    mode="time"
                    is24Hour={true}
                    onChange={onChange}
                />
    );
};