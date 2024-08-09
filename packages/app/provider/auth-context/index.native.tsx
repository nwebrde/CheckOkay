import React, { useEffect, useState } from 'react'
import { useStorageState } from 'expo-app/lib/useStorageState'
import { refresh, signIn, signOut } from 'expo-app/lib/OAuthClient'
import { NativeAuthContext, User } from 'app/provider/auth-context/types'
import { setLocalAccessToken, setLocalRefreshToken } from 'app/provider/auth-context/state.native'

const AuthContext = React.createContext<NativeAuthContext | null>(null)

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
    const [[accessTokenLoading, accessToken], setAccessToken] =
        useStorageState('accessToken')
    const [[refreshTokenLoading, refreshToken], setRefreshToken] =
        useStorageState('refreshToken')

    setLocalAccessToken(accessToken)
    setLocalRefreshToken(refreshToken)

    let authValue = {
        signIn: async () => {
            return await signIn(setAccessToken, setRefreshToken)
        },
        refresh: async (refreshTokenLocal: string) => {
            return await refresh(setAccessToken, setRefreshToken, refreshTokenLocal)
        },
        signOut: async () => {
            return await signOut(setAccessToken, setRefreshToken, refreshToken)
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
        isLoading: refreshTokenLoading || accessTokenLoading,
        user: undefined,
    }

    useEffect(() => {
        setLocalAccessToken(accessToken)
        setLocalRefreshToken(refreshToken)
    }, [accessToken, refreshToken])

    return (
        <AuthContext.Provider value={authValue}>
            {props.children}
        </AuthContext.Provider>
    )
}
