import { View } from 'app/design/view'
import { Text } from 'app/design/typography'

export function SettingsRow({children, label, fullsize = false}) {
    return (
        <>
            <View className={"flex " + fullsize ? "flex-row" : "flex-col"}>
                <Text className="grow">{label}</Text>
                <View className="">
                    {children}
                </View>
            </View>
        </>
    )
}