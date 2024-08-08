import { useRelativePush } from 'app/lib/routing/push'
import { Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser';

export default function Link({children, href, useRelative, ...props}) {
    const router = useRouter()
    if(href.startsWith("https://")) {
        return <Pressable onPress={() => WebBrowser.openBrowserAsync(href)} {...props }>{children}</Pressable>
    }
    return <Pressable onPress={() => router.push(useRelative ? "./" + href : "../" + href)} {...props }>{children}</Pressable>
}