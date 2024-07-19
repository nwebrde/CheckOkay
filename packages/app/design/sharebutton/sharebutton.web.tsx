import React, { ReactNode } from 'react'
import { RWebShare } from 'react-web-share'
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
    return (
        <div>
            <RWebShare
                data={{
                    url: link,
                    title: title,
                    text: msg,
                }}
                onClick={onPress}
            >
                <Button text={title} />
            </RWebShare>
        </div>
    )
}
