declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: User
    }

    export class User {
        name: string
        email: string
        id: string
        image: string
    }
}