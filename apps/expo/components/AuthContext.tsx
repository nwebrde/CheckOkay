import React from 'react';
import {useStorageState} from "../lib/useStorageState";
import {refresh, signIn, signOut} from "../lib/OAuthClient";

const AuthContext = React.createContext<{ signIn: () => Promise<boolean>; refresh: () => Promise<null | {accessToken: string, refreshToken: string | null}>; signOut: () => Promise<boolean>; accessToken: string | null, refreshToken: string | null, isLoading: boolean } | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useAuth must be wrapped in a <AuthProvider />');
        }
    }

    return value;
}

export function AuthProvider(props: React.PropsWithChildren) {

    const [[accessTokenLoading, accessToken], setAccessToken] = useStorageState('accessToken');
    const [[refreshTokenLoading, refreshToken], setRefreshToken] = useStorageState('refreshToken');

    const authValue = {
        signIn: async () => {
            return await signIn(setAccessToken, setRefreshToken);
        },
        refresh: async () => {
            return await refresh(setAccessToken, setRefreshToken, refreshToken);
        },
        signOut: async () => {
            return await signOut(setAccessToken, setRefreshToken, refreshToken);
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
        isLoading: refreshTokenLoading || accessTokenLoading
    };

    return (
        <AuthContext.Provider value={authValue}>
            {props.children}
        </AuthContext.Provider>
    );
}
