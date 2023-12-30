import * as AuthSession from 'expo-auth-session'
import { router } from 'expo-router'
import { DiscoveryDocument } from 'expo-auth-session'
import type { User } from 'app/provider/auth-context/types'

const redirectUri = AuthSession.makeRedirectUri({})

// Endpoint
const discovery: DiscoveryDocument = {
    authorizationEndpoint: 'http://localhost:3000/api/oauth2/authorize',
    tokenEndpoint: 'http://localhost:3000/api/oauth2/token',
    revocationEndpoint: 'http://localhost:3000/api/oauth2/token/revoke',
}
const clientId = 'BeingWellApp'

type TokenSetter = (token: string | null) => void

export const signIn = async (
    setAccessToken: TokenSetter,
    setRefreshToken: TokenSetter,
) => {
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
            },
            discovery,
        )

        setAccessToken(tokenResult.accessToken)
        setRefreshToken(
            tokenResult.refreshToken ? tokenResult.refreshToken : null,
        )

        // Navigate after signing in. You may want to tweak this to ensure sign-in is
        // successful before navigating.
        router.replace('/')

        return true
    }
    return false
}

export const refresh = async (
    setAccessToken: TokenSetter,
    setRefreshToken: TokenSetter,
    refreshToken: string | null,
) => {
    if (!refreshToken) {
        return null
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

    setAccessToken(tokenResult.accessToken)
    setRefreshToken(tokenResult.refreshToken ? tokenResult.refreshToken : null)

    return {
        accessToken: tokenResult.accessToken,
        refreshToken: tokenResult.refreshToken
            ? tokenResult.refreshToken
            : null,
    }
}

export const signOut = async (
    setAccessToken: TokenSetter,
    setRefreshToken: TokenSetter,
    refreshToken: string | null,
) => {
    if (!refreshToken) {
        return false
    }
    const revoked = await AuthSession.revokeAsync(
        { token: refreshToken },
        discovery,
    )
    if (!revoked) return false

    setAccessToken(null)
    setRefreshToken(null)

    return true

    // The default revokeAsync method doesn't work for Keycloak, we need to explicitely invoke the OIDC endSessionEndpoint with the correct parameters
    /*
    const logoutUrl = `${discovery.endSessionEndpoint!}?client_id=${clientId}&post_logout_redirect_uri=${redirectUrl}&id_token_hint=${idToken}`;

    const res = await WebBrowser.openAuthSessionAsync(logoutUrl, redirectUrl);
    if (res.type === "success") {
        setAccessToken(undefined);
        setIdToken(undefined);
        setRefreshToken(undefined);
    }

     */
}

export function generateShortUUID() {
    return Math.random().toString(36).substring(2, 15)
}
