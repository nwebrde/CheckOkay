import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db, tableCreator } from 'db'
import DiscordProvider from 'next-auth/providers/discord'
import AppleProvider from "next-auth/providers/apple"
import GoogleProvider from "next-auth/providers/google"
import { Session, User } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";


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
    pages: {
        signIn: '/auth/signin'
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
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        /*
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Demo",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const user = { id: "demo", name: "Frida Freude", email: "fridafreude@example.de" }

                if (credentials?.username === "demo" && credentials?.password === process?.env.DEMO_PASSWORD) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })

         */
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
        }
    },
})

interface SessionCallbackParam {
    session: Session
    user: User
}


