import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db, tableCreator } from 'db'
import DiscordProvider from 'next-auth/providers/discord'
import AppleProvider from "next-auth/providers/apple"
import GoogleProvider from "next-auth/providers/google"
import { Session, User } from 'next-auth'

interface Profile {
    name: {
        firstName: string,
        lastName: string
    }
}

export const authOptions = (userObject: Profile | undefined = undefined) => ({
    theme: {
        brandColor: "#2F5651", // Hex color code
        logo: "https://checkokay.com/logo-light.png", // Absolute URL to image
        buttonText: "#ffffff" // Hex color code
    },
    session: {
        // Choose how you want to save the user session.
        // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
        // If you use an `adapter` however, we default it to `"database"` instead.
        // You can still force a JWT session by explicitly defining `"jwt"`.
        // When using `"database"`, the session cookie will only contain a `sessionToken` value,
        // which is used to look up the session in the database.

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 12 * 30 * 24 * 60 * 60, // 365 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours
    },
    adapter: DrizzleAdapter(db, tableCreator),
    providers: [
        DiscordProvider({
            clientId: process.env.AUTH_DISCORD_ID!,
            clientSecret: process.env.AUTH_DISCORD_SECRET!,
        }),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID!,
            clientSecret: process.env.APPLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "name email",
                    response_mode: "form_post",
                    response_type: "code",
                },
            },
            profile(profile) {
                if (userObject) {
                    profile.name = `${userObject.name.firstName} ${userObject.name.lastName}`;
                }

                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: null,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    cookies: {
        callbackUrl: {
            name: `__Secure-next-auth.callback-url`,
            options: {
                httpOnly: false,
                sameSite: "none",
                path: "/",
                secure: true,
            },
        },
        pkceCodeVerifier: {
            name: 'next-auth.pkce.code_verifier',
            options: {
                httpOnly: true,
                sameSite: 'none',
                path: '/',
                secure: true
            }
        }
    },
    callbacks: {
        async session(param: SessionCallbackParam) {
            // Send properties to the client, like an access_token and user id from a provider.
            param.session.user.id = param.user.id
            return param.session
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/app');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },
})

interface SessionCallbackParam {
    session: Session
    user: User
}


