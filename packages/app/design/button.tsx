import React from 'react'

import { Text, Pressable, GestureResponderEvent } from 'react-native'
import { styled } from 'nativewind'

export const StyledPressable = styled(Pressable)
const StyledText = styled(Text)

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
