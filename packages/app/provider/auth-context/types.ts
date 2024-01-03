export interface NativeAuthContext extends CommonAuthContext {
    refresh: () => Promise<boolean>
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
