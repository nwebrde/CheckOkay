export interface WebAuthContext extends CommonAuthContext {
    isLoading: boolean
}

export type CommonAuthContext = {
    signOut: () => Promise<boolean>
    signIn: () => Promise<boolean>
}

export type User = {
    name?: string | null
    email?: string | null
    image?: string | null
}
