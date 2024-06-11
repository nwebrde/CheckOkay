import { View } from 'app/design/view'
import { Text } from 'app/design/typography'

export function SettingsGroup({children, title}) {
    return (
        <>
            <Text>{title}</Text>
            <View className="bg-white rounded-lg flex flex-col divide-y">
                {children}
            </View>
        </>
    )
}