import React, { ReactNode } from 'react'
import { RWebShare } from 'react-web-share'
import { AnimatedPressable, Button } from 'app/design/button'

export const ShareButton = ({
    children,
    link,
    title,
    msg,
}: {
    children: ReactNode
    link: string
    title: string
    msg: string
}) => {
    return (
        <div>
            <RWebShare
                data={{
                    url: link,
                    title: title,
                    text: msg,
                }}
                onClick={() => console.log('shared successfully!')}
            >
                <Button text={title} onClick={() => {}} />
            </RWebShare>
        </div>
    )
}
