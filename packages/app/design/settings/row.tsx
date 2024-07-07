import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { ChevronRight } from 'app/design/icons'
import { cn } from 'app/lib/utils'
import { StyledPressable } from 'app/design/button'
import { useRelativePush } from 'app/lib/router-push/push'

type Props = {
    children: React.ReactNode
    label: string
    description: string | undefined
    separator: boolean
    fullsize: boolean
    active: boolean
    link: string | undefined,
    linkTitle: string | undefined
}

export function SettingsRow({children, label, description, separator = true, fullsize = false, link, linkTitle, active = false}: Props) {
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
            <StyledPressable className="active:bg-white hover:bg-white" onPress={() => {push(link)}}>
                <Row />
            </StyledPressable>
            }
            {(!link || active) &&
                <Row />
            }
        </>
    )
}