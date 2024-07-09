import React, { ComponentProps, forwardRef } from 'react'
import { Text as NativeText, Platform, Linking, TextStyle } from 'react-native'
import { TextLink as SolitoTextLink } from 'solito/link'
import { MotiLink as MLink } from 'solito/build/moti/app'
import { classed } from 'app/classed.config'

function StyledText({ className, ...props }) {
    return (<NativeText className={className} {...props } />)
}

export const Text = classed(StyledText, {

    variants: {
        type: {
            H1: "text-red-500 text-3xl font-extrabold my-7 text-slate-900",
            H2: "text-xl font-semibold my-3 text-slate-900",
            H3: "text-large font-medium my-3 text-slate-900 underline",
            base: "text-xl font-normal text-slate-900",
            label: "text-xl font-medium text-black",
            labelDescription: "text-lg font-normal text-black leading-snug",
            unstyled: ""
        }
    },
    defaultVariants: {
        type: "base",
    }
})

/**
 * You can use this pattern to create components with default styles
 */
export function P({ className, ...props }) {
    return (<NativeText className={'text-base text-black my-4 ' + className} {...props } />)
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
