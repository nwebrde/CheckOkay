/**
 * LocalAccessToken and RefreshToken are synchronly updated on signIn(), refresh() and signOut().
 * Can be accessed by logic code (not react).
 * Advantage over useAuth().accessToken: This value is not synchronly updated!
 */
export let localAccessToken: string | null = null
export let localRefreshToken: string | null = null
export function setLocalAccessToken(token: string | null) {
    localAccessToken = token
}
export function setLocalRefreshToken(token: string | null) {
    localRefreshToken = token
}
