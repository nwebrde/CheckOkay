import { View } from 'app/design/view'
import { Text } from 'app/design/typography'

type Props = {
    children: React.ReactNode
    title: string | undefined
}
export function SettingsGroup({children, title}: Props) {
    return (
        <View className="my-4">
            {(title) &&
            <Text className="mb-2">{title}</Text>
            }
            <View className="bg-secondary border-[#c9ba97] border rounded-lg flex flex-col overflow-hidden">
                {children}
            </View>
        </View>
    )
}