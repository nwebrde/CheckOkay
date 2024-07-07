import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { ChevronRight } from 'app/design/icons'
import { cn } from 'app/lib/utils'
import { StyledLink } from 'app/design/button'
import { useRelativePush } from 'app/lib/routing/push'
import Link from 'app/lib/routing/Link'

type Props = {
    children: React.ReactNode
    label: string
    description: string | undefined
    separator: boolean
    fullsize: boolean
    active: boolean
    link: string | undefined,
    linkTitle: string | undefined,
    useRelative: boolean
}

export function SettingsRow({children, label, description, separator = true, fullsize = false, link, linkTitle, useRelative = true, active = false}: Props) {
    const push = useRelativePush()

    const Row = () => {
        return <View className={cn(
            'flex p-3 flex-wrap flex-row',
            separator
                ? 'border-b border-[#c9ba97]'
                : '',
            active
                ? 'bg-white'
                : ''
        )
        }>
            <Text type="label" className="grow">{label}</Text>



            {(link && !active) &&
                <>
                {linkTitle &&
                    <Text type="unstyled" className="font-semibold text-lg text-[#c9ba97]">{linkTitle}</Text>
                }
                <ChevronRight className="text-[#c9ba97] stroke-2" />
                </>
            }

            {(description && fullsize) &&
                <Text type="labelDescription" className="w-full mt-2">{description}</Text>
            }
            <View>
                {children}
            </View>

            {(description && !fullsize) &&
            <Text type="labelDescription" className="basis-full w-full mt-2">{description}</Text>
            }
        </View>
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