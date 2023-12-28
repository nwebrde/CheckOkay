import React from 'react';

import {Text, Pressable, GestureResponderEvent} from 'react-native';
import { styled } from 'nativewind';

const StyledPressable = styled(Pressable)
const StyledText = styled(Text)

export interface ButtonProps {
    text: string;
    onClick?: (event: GestureResponderEvent) => void;
}

export function Button({ text, onClick }: ButtonProps) {
    return (
        <StyledPressable onPress={onClick} className={`
      flex-1
      items-center
      justify-center
      hover:bg-slate-300
      active:bg-slate-500
    `}>
            <StyledText
                selectable={false}
                className="text-slate-800"
            >
                {text}
            </StyledText>
        </StyledPressable>
    );
}
