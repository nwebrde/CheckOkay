import React, { ReactElement } from 'react'
import { Children } from 'react'

import { H1 } from 'app/design/typography'
import { View } from 'app/design/view'

export interface FormLayoutProps {
    labels: string[]
    children: ReactElement[]
}

export function FormLayout({ labels, children }: FormLayoutProps) {
    return (
        <View>
            {Children.map(children, (child, index) => {
                const isLast = index === children.length - 1
                return (
                    <>
                        <FormLabel label={labels[index]} />
                        {child}
                    </>
                )
            })}
        </View>
    )
}

export function FormLabel({ label }: { label?: string }) {
    if (!label) {
        return <></>
    }
    return <H1>{label}</H1>
}
