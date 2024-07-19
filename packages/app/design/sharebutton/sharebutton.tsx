import React, { ReactNode } from 'react'
import { Alert, Share } from 'react-native'
import { AnimatedPressable, Button } from 'app/design/button'

export const ShareButton = ({
    children,
    link,
    title,
    msg,
    onPress
}: {
    children: ReactNode
    link: string
    title: string
    msg: string
    onPress: () => void
}) => {
    const onShare = async () => {
        try {
            const result = await Share.share({
                url: link,
                title: title,
                message: msg,
            })
            if (result.action === Share.sharedAction) {
                onPress()
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert(error.message)
        }
    }
    return <Button text={title} onClick={onShare} />
}
