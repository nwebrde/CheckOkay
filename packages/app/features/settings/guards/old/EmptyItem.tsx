import { Text } from 'app/design/typography'
import { View } from 'app/design/view'
import { Button } from 'app/design/button'

export function EmptyItem({ invite }: { invite: () => void }) {
    return (
        <View className="flex-col items-center justify-center">
            <Text className="mb-4 w-full text-lg">
                Du hast noch keine Beschützer. Lade jetzt Personen ein, die
                benachrichtigt werden wenn du nicht mehr reagierst.
            </Text>
            <View className="max-w-fit">
                <Button text="Personen einladen" onClick={invite} />
            </View>
        </View>
    )
}
