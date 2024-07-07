import NextLink from "next/link"
import { usePathname } from 'next/navigation'
export default function Link({children, href, useRelative, ...props}) {
    const path = usePathname()
    return <NextLink {...props } href={(useRelative) ? (path + "/" + href) : href}>{children}</NextLink>
}