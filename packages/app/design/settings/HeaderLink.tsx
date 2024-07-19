import { StyledLink, StyledPressable } from 'app/design/button'
import { View } from 'app/design/view'
import { Plus } from 'app/design/icons'
import { Text } from 'app/design/typography'
import React from 'react'

export const HeaderLink = ({href, onPress, useRelative = true, title = "Hinzufügen", icon = <Plus className="text-primary stroke-2" />}: {
    href: string | undefined, onPress: (() => void) | undefined, useRelative: boolean, title: string, icon: React.ReactElement
}) => {
    const Inner = () => <View className="flex flex-row items-center gap-1">{icon}<Text className="text-primary font-medium">{title}</Text></View>

    if(href) {
        return <StyledLink href={href} useRelative={useRelative}><Inner /></StyledLink>
    }
    else if (onPress) {
        return <StyledPressable onPress={onPress}><Inner /></StyledPressable>
    }
    else {
        return <Inner />
    }
}


