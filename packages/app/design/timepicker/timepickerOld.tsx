import { useCallback, useEffect, useState } from 'react'
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Modal, Pressable, StyleProp, ViewStyle } from 'react-native'
import { View } from 'app/design/view'
import { P, Text } from 'app/design/typography'
import { localToUTC, UTCToLocal } from 'app/lib/time'
import { Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger } from 'app/design/dialog'
import { Button } from 'app/design/button'

export type Props = {
    hour: number // in UTC format
    minute: number // in UTC format
    displayTimeInLocalFormat?: boolean // false default
    onChange: (hour: number, minute: number) => void // hour and minute in UTC format
    unit?: string
    style?: StyleProp<ViewStyle>
}

export const TimepickerOld = ({
    hour,
    minute,
    displayTimeInLocalFormat,
    onChange,
    unit,
    style,
}: Props) => {
    const [time, setTime] = useState<Date>(new Date())

    useEffect(() => {
        /*
        if (displayTimeInLocalFormat) {
            setTime(UTCToLocal(hour, minute).date!)
        } else {
            const date = new Date()
            date.setMinutes(minute)
            date.setHours(hour)
            setTime(date)
        }

         */
    }, [hour, minute, displayTimeInLocalFormat])

    const change = useCallback(
        (event: DateTimePickerEvent, selectedTime?: Date) => {
            /*
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

             */
        },
        [onChange, displayTimeInLocalFormat],
    )

    const [modal, setModal] = useState(false)

    return (

        <Dialog>
            <DialogTrigger asChild>
               <Text>sss</Text>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <DateTimePicker
                    style={{ width: 200 }}
                    value={time!}
                    mode="time"
                    display="spinner"
                    is24Hour={true}
                    onChange={change}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button text="ok" />
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
