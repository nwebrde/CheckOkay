import * as AuthSession from 'expo-auth-session'
import { router } from 'expo-router'
import { DiscoveryDocument } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store';

const redirectUri = AuthSession.makeRedirectUri({})

// Endpoint
const discovery: DiscoveryDocument = {
    authorizationEndpoint: process.env.EXPO_PUBLIC_OAUTH_AUTHORIZATION_ENDPOINT!,
    tokenEndpoint: process.env.EXPO_PUBLIC_OAUTH_TOKEN_ENDPOINT!,
    revocationEndpoint: process.env.EXPO_PUBLIC_OAUTH_REVOCATION_ENDPOINT!,
}
const clientId = process.env.EXPO_PUBLIC_OAUTH_CLIENT_ID!

const accessTokenKey = "accessToken"
const refreshTokenKey = "refreshToken"

export const getAccessToken = () => SecureStore.getItemAsync(accessTokenKey)
export const getRefreshToken = () => SecureStore.getItemAsync(refreshTokenKey)

export const signIn = async () => {
    const state = generateShortUUID()
    // Get Authorization code
    const authRequestOptions: AuthSession.AuthRequestConfig = {
        responseType: AuthSession.ResponseType.Code,
        clientId,
        redirectUri: redirectUri,
        prompt: AuthSession.Prompt.Login,
        scopes: ['all'],
        state: state,
        usePKCE: true,
    }
    const authRequest = new AuthSession.AuthRequest(authRequestOptions)
    const authorizeResult = await authRequest.promptAsync(discovery, {})

    if (authorizeResult.type === 'success') {
        // If successful, get tokens
        const tokenResult = await AuthSession.exchangeCodeAsync(
            {
                code: authorizeResult.params.code!,
                clientId: clientId,
                redirectUri: redirectUri,
                extraParams: {
                    code_verifier: authRequest.codeVerifier || '',
                },
                scopes: ['all']
            },
            discovery,
        )

        await SecureStore.setItemAsync(accessTokenKey, tokenResult.accessToken);

        if(!tokenResult.refreshToken) {
            await SecureStore.deleteItemAsync(refreshTokenKey)
        } else {
            await SecureStore.setItemAsync(refreshTokenKey, tokenResult.refreshToken)
        }


        // Navigate after signing in. You may want to tweak this to ensure sign-in is
        // successful before navigating.
        router.replace('/')

        return true
    }
    return false
}

export const refresh = async () => {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) {
        return false
    }

    const refreshTokenObject: AuthSession.RefreshTokenRequestConfig = {
        clientId: clientId,
        refreshToken: refreshToken,
        scopes: ['all'],
    }
    const tokenResult = await AuthSession.refreshAsync(
        refreshTokenObject,
        discovery,
    )

    await SecureStore.setItemAsync(accessTokenKey, tokenResult.accessToken);
    if(!tokenResult.refreshToken) {
        await SecureStore.deleteItemAsync(refreshTokenKey)
    } else {
        await SecureStore.setItemAsync(refreshTokenKey, tokenResult.refreshToken)
    }
    return true
}

export const signOut = async () => {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) {
        return false
    }
    const revoked = await AuthSession.revokeAsync(
        { token: refreshToken },
        discovery,
    )
    if (!revoked) return false

    await SecureStore.deleteItemAsync(accessTokenKey)
    await SecureStore.deleteItemAsync(refreshTokenKey)

    return true
}

export function generateShortUUID() {
    return Math.random().toString(36).substring(2, 15)
}
