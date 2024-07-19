import { Userpic } from 'react-native-userpic';
import { trpc } from 'app/provider/trpc-client'
import { useEffect } from 'react'
export function UserAvatar() {
    const query = trpc.getUser.useQuery()
    return(
        <Userpic
            size={60}
            source={query.data?.image ? { uri: query.data?.image } : undefined}
            email={query.data?.email}
            name={query.data?.name}
            colorize={true}
            radius={20}
        />
    )
}