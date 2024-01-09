import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db, tableCreator } from 'db'
import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Session, User } from 'next-auth'

export const authOptions = {
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
        {
            id: 'ses',
            type: 'email',
            // @ts-ignore
            async sendVerificationRequest({ identifier: email, url }) {
                // Call the cloud Email provider API for sending emails
                // See https://docs.sendgrid.com/api-reference/mail-send/mail-send
                const response = await fetch(
                    'https://api.sendgrid.com/v2/email/outbound-emails',
                    {
                        // The body format will vary depending on provider, please see their documentation
                        // for further details.
                        body: JSON.stringify({
                            personalizations: [{ to: [{ email }] }],
                            from: { email: 'noreply@company.com' },
                            subject: 'Sign in to BeingWellApp',
                            content: [
                                {
                                    type: 'text/plain',
                                    value: `Please click here to authenticate - ${url}`,
                                },
                            ],
                        }),
                        headers: {
                            // Authentication will also vary from provider to provider, please see their docs.
                            Authorization: `Bearer ${process.env.SENDGRID_API}`,
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                    },
                )

                if (!response.ok) {
                    const { errors } = await response.json()
                    throw new Error(JSON.stringify(errors))
                }
            },
        },
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'jsmith@mail.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const res = await fetch('/your/endpoint', {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { 'Content-Type': 'application/json' },
                })
                const user = await res.json()

                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            },
        }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Sign up',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'jsmith@mail.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const res = await fetch('/your/endpoint', {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { 'Content-Type': 'application/json' },
                })

                const user = await res.json()

                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            },
        }),
    ],
    callbacks: {
        async session(param: SessionCallbackParam) {
            // Send properties to the client, like an access_token and user id from a provider.
            param.session.user.id = param.user.id
            return param.session
        },
    },
}

interface SessionCallbackParam {
    session: Session
    user: User
}
