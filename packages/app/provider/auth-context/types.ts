export interface NativeAuthContext extends CommonAuthContext {
    refresh: () => Promise<null | {
        accessToken: string
        refreshToken: string | null
    }>
    accessToken: string | null
    refreshToken: string | null
}

export type CommonAuthContext = {
    signOut: () => Promise<boolean>
    signIn: () => Promise<boolean>
    user?: User
    isLoading: boolean
}

export type User = {
    name?: string | null
    email?: string | null
    image?: string | null
}
