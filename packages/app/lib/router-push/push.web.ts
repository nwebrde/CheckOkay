import { usePathname, useRouter } from 'solito/navigation'

/**
 * NextJS Router does not support relative paths
 * @param href relative path starting with "settings"
 */
export function useRelativePush() {
    const router = useRouter()
    const path = usePathname();
    return (href: string) => router.push(href)
}