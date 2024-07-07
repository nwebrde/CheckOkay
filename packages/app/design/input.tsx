import * as React from 'react';
import { TextInput } from 'react-native';
import { cn } from 'app/lib/utils';
import { View } from 'app/design/view'
import { useState } from 'react'

const Input = React.forwardRef<
    React.ElementRef<typeof TextInput>,
    React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, placeholderClassName, ...props }, ref) => {
    const [focus, setFocus] = useState("border-transparent")
    return (
        <View className={`border-2 ${focus} p-0.5 rounded-xl`}>
        <TextInput
            ref={ref}
            onFocus={() => {setFocus("border-gray-800")}}
            onBlur={() => {setFocus("border-transparent")}}
            className={cn(
                'web:flex h-10 native:h-12 web:w-full rounded-lg border border-gray-400 bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
                props.editable === false && 'opacity-50 web:cursor-not-allowed',
                className
            )}
            placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
            {...props}
        />
        </View>
    );
});

Input.displayName = 'Input';

export { Input };