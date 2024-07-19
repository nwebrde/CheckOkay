import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { UserAvatar } from 'app/features/user/UserAvatar'
import { trpc } from 'app/provider/trpc-client'
import { Skeleton } from 'moti/skeleton'

export function PublicProfile() {
    const query = trpc.getUser.useQuery()
    return(
        <View className="flex flex-col">
            <Text>
                So sehen dich deine Beschützer
            </Text>

            <Skeleton colorMode="light" width={'100%'} show={query.isLoading}>
                <View className="flex flex-row">
                    <UserAvatar />
                    <Text>{query.data?.name ?? query.data?.email}</Text>
                </View>
            </Skeleton>


        </View>
    )
}