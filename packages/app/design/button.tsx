import React, { ReactNode } from 'react'
import { Text, Pressable, GestureResponderEvent } from 'react-native'
import { MotiLink as MLink } from 'solito/moti/app'
import { MotiPressable } from 'moti/interactions'
import { classed } from 'app/classed.config'
import { View } from 'app/design/view'
import Link from 'app/lib/routing/Link'

export function StyledPressable({ className, ...props }) {
    return(<Pressable className={className}{...props } />)
}
function StyledText({ className, ...props }) {
    return (
        <Text
            className={className}
            {...props }
        />
    );
}

export interface ButtonProps {
    text: string
    onClick?: (event: GestureResponderEvent) => void
}

export function Button({ text, onClick }: ButtonProps) {
    return (
        <StyledPressable
            onPress={onClick}
            className={`
      rounded border border-gray-300 bg-white bg-opacity-30 px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 active:ring-4
    `}
        >
            <StyledText selectable={false} className="text-slate-800">
                {text}
            </StyledText>
        </StyledPressable>
    )
}

export function MotiLink({ className, ...props }) {
    return (<MLink className={className} {...props } />)
}

export function StyledLink({ children, className, ...props }) {
    return(<Link className={className} {...props }>{children}</Link>)
}

export function AnimatedLink({
    children,
    href,
}: {
    children: ReactNode
    href: string
}) {
    return (
        <MotiLink
            href={href}
            className="h-fit"
            animate={({
                hovered,
                pressed,
            }: {
                hovered: boolean
                pressed: boolean
            }) => {
                'worklet'

                return {
                    scale: pressed ? 0.95 : hovered ? 1.1 : 1,
                    rotateZ: pressed ? '0deg' : hovered ? '-3deg' : '0deg',
                }
            }}
            transition={{
                type: 'timing',
                duration: 150,
            }}
        >
            {children}
        </MotiLink>
    )
}

export function AnimatedPressable({
    children,
    onClick,
}: {
    children: ReactNode
    onClick: () => void
}) {
    return (
        <MotiPressable
            onPress={onClick}
            animate={({ hovered, pressed }) => {
                'worklet'

                return {
                    scale: pressed ? 0.95 : hovered ? 1.1 : 1,
                    rotateZ: pressed ? '0deg' : hovered ? '-3deg' : '0deg',
                }
            }}
            transition={{
                type: 'timing',
                duration: 150,
            }}
        >
            {children}
        </MotiPressable>
    )
}
