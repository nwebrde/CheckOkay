import { HomeScreen as Screen } from 'app/features/home/screen'
import { useAuth } from 'app/provider/auth-context'
import { ActivityIndicator } from 'react-native'

export default function HomeScreen() {
    const { user, isLoading, signIn } = useAuth()!
    if (isLoading) {
        return <ActivityIndicator />
    } else if (!user) {
        signIn().then((r) => {})
    }
    return <Screen />
}
