import { useRouter } from 'expo-router'

/**
 * Expo router supports relative paths
 * @param href
 */
export function useRelativePush() {
    const router = useRouter()
    return (href: string) => router.push("./" + href)
}