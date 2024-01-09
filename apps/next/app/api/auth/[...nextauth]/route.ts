import type { Session, User } from 'next-auth'
import NextAuth from 'next-auth'
import { authOptions } from '../../../../server/lib/nextAuthOptions'

// @ts-ignore
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
