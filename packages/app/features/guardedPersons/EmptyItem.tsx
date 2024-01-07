import { Text } from 'app/design/typography'
import { View } from 'app/design/view'

export function EmptyItem() {
    return (
        <View className="flex-col items-center justify-center">
            <Text className="mb-4 w-full text-lg">
                Du hast noch niemanden den du beschützt. {'\n'}
                Rege deine Freunde dazu ein, dich als Guard einzuladen.
            </Text>
        </View>
    )
}
