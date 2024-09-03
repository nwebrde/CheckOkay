import React from 'react'
import { signIn, signOut } from 'expo-app/lib/OAuthClient'
import { CommonAuthContext } from 'app/provider/auth-context/types'

const AuthContext = React.createContext<CommonAuthContext | null>(null)

// This hook can be used to access the user info.
export function useAuth() {
    const value = React.useContext(AuthContext)
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useAuth must be wrapped in a <AuthProvider />')
        }
    }

    return value
}

export function AuthProvider(props: React.PropsWithChildren) {
    let authValue = {
        signIn: async () => {
            return await signIn()
        },
        signOut: async () => {
            return await signOut()
        }
    }

    return (
        <AuthContext.Provider value={authValue}>
            {props.children}
        </AuthContext.Provider>
    )
}
