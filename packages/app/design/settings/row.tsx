import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { ChevronRight } from 'app/design/icons'
import { cn } from 'app/lib/utils'
import { StyledLink, StyledPressable } from 'app/design/button'
import { useRelativePush } from 'app/lib/routing/push'
import Link from 'app/lib/routing/Link'
import { ReactElement } from 'react'

type Props = {
    label: string
    headerChild: React.ReactNode // placed next to label
    description: string | undefined // placed below title
    children: React.ReactNode // placed below description
    separator: boolean // whether bottom border should be visible
    active: boolean // whether current item is selected
    link: string | undefined, // link to page on click
    linkTitle: string | undefined, // placed left to the chevron
    useRelative: boolean,
    onPress: (() => void) | undefined
}

function Row({children, headerChild, label, description, separator = true, link, linkTitle, active = false}: Props) {
    return (
        <View className={cn(
            'flex p-3 flex-col gap-2',
            separator
                ? 'border-b border-[#c9ba97]'
                : '',
            active
                ? 'bg-white'
                : ''
        )
        }>
            <View className="flex flex-row justify-between items-center gap-2 overflow-hidden">
                <Text type="label" className="shrink w-fit">{label}</Text>

                {headerChild &&
                    <View className="max-w-[75%]">
                        {headerChild}
                    </View>
                }

                {(link && !active) &&
                    <View className="flex flex-row w-fit max-w-[75%]">
                        {linkTitle &&
                            <Text type="unstyled" className="w-fit font-semibold text-lg text-[#c9ba97]">{linkTitle}</Text>
                        }
                        <ChevronRight className="text-[#c9ba97] stroke-2" />
                    </View>
                }
            </View>

            {(description) &&
                <Text type="labelDescription" className="w-full">{description}</Text>
            }
            {(children) &&
            <View>
                {children}
            </View>
            }
        </View>
    )
}

export function SettingsRow({children, headerChild, label, description, separator = true, link, linkTitle, useRelative = true, active = false, onPress}: Props) {

    return (
        <>
            {(link && !active) &&
            <StyledLink className="active:bg-white hover:bg-white" useRelative={useRelative} href={link}>
                <Row headerChild={headerChild} label={label} separator={separator} active={active} link={link} linkTitle={linkTitle} description={description}>
                    {children}
                </Row>
            </StyledLink>
            }
            {((!link && !onPress) || active) &&
                <Row headerChild={headerChild} label={label} separator={separator} active={active} link={link} linkTitle={linkTitle} description={description}>
                    {children}
                </Row>
            }
            {(onPress) &&
                <StyledPressable className="active:bg-white hover:bg-white" onPress={onPress}>
                    <Row headerChild={headerChild} label={label} separator={separator} active={active} link={link} linkTitle={linkTitle} description={description}>
                        {children}
                    </Row>
                </StyledPressable>
            }
        </>
    )
}