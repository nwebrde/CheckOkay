'use client'

import { ActivityIndicator } from 'react-native'
import { signIn } from 'next-auth/react'

export default function SignInScreen() {
    signIn("github")
    return(<ActivityIndicator />)
}