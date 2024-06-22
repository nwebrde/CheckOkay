import React, { ComponentProps, forwardRef } from 'react'
import { Text as NativeText, Platform, Linking, TextStyle } from 'react-native'
import { TextLink as SolitoTextLink } from 'solito/link'
import { MotiLink as MLink } from 'solito/build/moti/app'

export function Text({ className, ...props }) {
    return (<NativeText className={className} {...props } />)
}

/**
 * You can use this pattern to create components with default styles
 */
export function P({ className, ...props }) {
    return (<NativeText className={'text-base text-black my-4 ' + className} {...props } />)
}

/**
 * Components can have defaultProps and styles
 */
export function H1({ className, ...props }) {
    return (<NativeText className={'text-3xl font-extrabold my-7 ' + className} {...props } />)
}
H1.defaultProps = {
    accessibilityLevel: 1,
    accessibilityRole: 'header',
}

export function Label({ className, ...props }) {
    return (<NativeText className={'text-xl font-extrabold my-1 ' + className} {...props } />)
}

/**
 * This is a more advanced component with custom styles and per-platform functionality
 */
export interface AProps extends ComponentProps<typeof Text> {
    href?: string
    target?: '_blank'
}

export const A = forwardRef<NativeText, AProps>(function A(
    { className = '', href, target, ...props },
    ref,
) {
    const nativeAProps = Platform.select<Partial<AProps>>({
        web: {
            href,
            target,
            hrefAttrs: {
                rel: 'noreferrer',
                target,
            },
        },
        default: {
            onPress: (event) => {
                props.onPress && props.onPress(event)
                if (Platform.OS !== 'web' && href !== undefined) {
                    Linking.openURL(href)
                }
            },
        },
    })

    return (
        <Text
            accessibilityRole="link"
            className={`text-blue-500 hover:underline ${className}`}
            {...props}
            {...nativeAProps}
            ref={ref}
        />
    )
})

/**
 * Solito's TextLink doesn't work directly with styled() since it has a textProps prop
 * By wrapping it in a function, we can forward style down properly.
 */
/*
export const TextLink = styled<
    ComponentProps<typeof SolitoTextLink> & { style?: TextStyle }
>(function TextLink({ style, textProps, ...props }) {
    return (
        <SolitoTextLink
            textProps={{ ...textProps, style: [style, textProps?.style] }}
            {...props}
        />
    )
}, 'text-base font-bold hover:underline text-blue-500')

 */

export function TextLink({ className, ...props }) {
    return (<SolitoTextLink {...props } />)
}
