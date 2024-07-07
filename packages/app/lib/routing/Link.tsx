import { useRelativePush } from 'app/lib/routing/push'
import { Pressable } from 'react-native'
import { useRouter } from 'expo-router'

export default function Link({children, href, useRelative, ...props}) {
    const router = useRouter()
    return <Pressable onPress={() => router.push(useRelative ? "./" + href : "../" + href)} {...props }>{children}</Pressable>
}