import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { ChevronRight } from 'app/design/icons'
import { cn } from 'app/lib/utils'
import { StyledLink } from 'app/design/button'
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
    useRelative: boolean
}

export function SettingsRow({children, headerChild, label, description, separator = true, link, linkTitle, useRelative = true, active = false}: Props) {
    const push = useRelativePush()

    const Row = () => {
        return (
            <View className={cn(
                'flex p-3 flex-col',
                separator
                    ? 'border-b border-[#c9ba97]'
                    : '',
                active
                    ? 'bg-white'
                    : ''
            )
            }>
                <View className="flex flex-row justify-end">
                    <Text type="label" className="basis-1/2 grow">{label}</Text>

                    {headerChild &&
                        <View className="basis 1/2">
                            {headerChild}
                        </View>
                    }

                    {(link && !active) &&
                        <>
                            {linkTitle &&
                                <Text type="unstyled" className="font-semibold text-lg text-[#c9ba97]">{linkTitle}</Text>
                            }
                            <ChevronRight className="text-[#c9ba97] stroke-2" />
                        </>
                    }
                </View>

                {(description) &&
                    <Text type="labelDescription" className="w-full mt-2">{description}</Text>
                }
                <View>
                    {children}
                </View>
            </View>
            )
    }

    return (
        <>
            {(link && !active) &&
            <StyledLink className="active:bg-white hover:bg-white" useRelative={useRelative} href={link}>
                <Row />
            </StyledLink>
            }
            {(!link || active) &&
                <Row />
            }
        </>
    )
}