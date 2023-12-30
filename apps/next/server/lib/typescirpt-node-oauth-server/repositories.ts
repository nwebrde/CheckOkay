import {
    GrantIdentifier,
    OAuthAuthCode,
    OAuthAuthCodeRepository,
    OAuthClient,
    OAuthScope,
    OAuthUser,
    OAuthUserRepository,
    OAuthClientRepository,
    OAuthScopeRepository,
    CodeChallengeMethod,
    OAuthTokenRepository,
    OAuthToken,
    DateInterval,
    ExtraAccessTokenFields,
} from '@jmondi/oauth2-server'
import { eq } from 'drizzle-orm'
import * as crypto from 'crypto'
import { ACCESS_TOKEN_INTERVAL, REFRESH_TOKEN_INTERVAL } from './index'
import { db } from 'db'
import { authCodes, refreshTokens } from 'db/schema/oauthserver'
import { users } from 'db/schema/auth'
const defaultScope = 'all'

/**
 * Important: supports only ONE scope.
 * But can be extended for multiple scope support (extend db schema).
 *
 * Important:
 */
export class AuthCodeRepository implements OAuthAuthCodeRepository {
    // Fetch auth code entity from storage by code
    async getByIdentifier(authCodeCode: string): Promise<OAuthAuthCode> {
        const result = await db
            .select()
            .from(authCodes)
            .where(eq(authCodes.authCode, authCodeCode))
        if (result.length > 0) {
            return {
                code: result[0].authCode,
                expiresAt: result[0].expiresAt,
                client: await new ClientRepository().getByIdentifier(
                    result[0].clientId,
                ),
                user: await new UserRepository().getUserByCredentials(
                    result[0].userId,
                ),
                codeChallenge: result[0].codeChallenge,
                codeChallengeMethod: result[0].codeChallengeMethod,
                redirectUri: result[0].redirectUri,
                scopes: await new ScopeRepository().getAllByIdentifiers([
                    result[0].scope,
                ]),
            }
        }
        throw new Error('auth code not found')
    }

    // An async call that should return an OAuthAuthCode that has not been
    // persisted to storage yet.
    issueAuthCode(
        client: OAuthClient,
        user: OAuthUser | undefined,
        scopes: OAuthScope[],
    ) {
        return {
            code: crypto.randomBytes(64).toString('hex'),
            codeChallengeMethod: 'SHA256' as CodeChallengeMethod,
            expiresAt: new DateInterval('15min').getEndDate(), // changing has no effect! expiration is overriden to 15min
            client: client,
            user: user,
            scopes: scopes,
        }
    }

    // An async call that should persist an OAuthAuthCode into your storage.
    async persist(authCode: OAuthAuthCode): Promise<void> {
        type NewEntry = typeof authCodes.$inferInsert
        const entry: NewEntry = {
            authCode: authCode.code,
            clientId: authCode.client.id,
            userId: authCode.user!.id.toString(),
            expiresAt: authCode.expiresAt,
            issuedAt: new Date(),
            redirectUri: authCode.redirectUri,
            scope: authCode.scopes[0] ? authCode.scopes[0].name : defaultScope,
            codeChallenge: authCode.codeChallenge!,
            codeChallengeMethod: authCode.codeChallengeMethod!,
        }
        await db.insert(authCodes).values(entry)
    }

    // This async method is called when an auth code is validated by the
    // authorization server. Return `true` if the auth code has been
    // manually revoked. If the code is still valid return `false`
    async isRevoked(authCodeCode: string): Promise<boolean> {
        let authCode

        try {
            authCode = await this.getByIdentifier(authCodeCode)
        } catch (e) {
            return true
        }

        return authCode.expiresAt < new Date()
    }

    async revoke(authCodeCode: string): Promise<void> {
        await db.delete(authCodes).where(eq(authCodes.authCode, authCodeCode))
    }
}

export class TokenRepository implements OAuthTokenRepository {
    // An async call that should return an OAuthToken that has not been
    // persisted to storage yet.
    async issueToken(
        client: OAuthClient,
        scopes: OAuthScope[],
        user?: OAuthUser,
    ): Promise<OAuthToken> {
        return {
            accessToken: crypto.randomBytes(64).toString('hex'),
            accessTokenExpiresAt: ACCESS_TOKEN_INTERVAL.getEndDate(), // has no effect! expiration is overriden by expriation set by enabled grant
            refreshToken: null,
            refreshTokenExpiresAt: null,
            client: client,
            user: user,
            scopes: scopes,
        }
    }

    // An async call that should persist an OAuthToken into your storage.
    async persist(accessToken: OAuthToken): Promise<void> {
        // do nothing as accessTokens are only kept on client side
    }

    // An async call that enhances an already-persisted OAuthToken with
    // refresh token fields.
    async issueRefreshToken(
        accessToken: OAuthToken,
        client: OAuthClient,
    ): Promise<OAuthToken> {
        const token = accessToken
        token.refreshToken = crypto.randomBytes(64).toString('hex')
        token.refreshTokenExpiresAt = REFRESH_TOKEN_INTERVAL.getEndDate()

        type NewEntry = typeof refreshTokens.$inferInsert
        const entry: NewEntry = {
            refreshToken: token.refreshToken,
            clientId: token.client.id,
            userId: token.user!.id.toString(),
            scope: token.scopes[0].name,
            expiresAt: token.refreshTokenExpiresAt,
        }
        await db.insert(refreshTokens).values(entry)
        return token
    }

    // This async method is called when a refresh token is used to reissue
    // an access token. The original access token is revoked, and a new
    // access token is issued.
    async revoke(accessToken: OAuthToken): Promise<void> {
        // for accessTokens, do nothing as they are treated as self-encoded JWTs with a short lifespan
        // for refreshTokens, we need to delete them in the db
        await db
            .delete(refreshTokens)
            .where(eq(refreshTokens.refreshToken, accessToken.refreshToken!))
    }

    // This async method, if implemented, will be called by the authorization
    // code grant if the original authorization code is reused.
    // See https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2 for why.
    revokeDescendantsOf?(authCodeId: string): Promise<void>

    // This async method is called when an access token is validated by the
    // authorization server. Return `true` if the access token has been
    // manually revoked. If the token is still valid return `false`
    async isRefreshTokenRevoked(refreshToken: OAuthToken): Promise<boolean> {
        const result = await db
            .select()
            .from(refreshTokens)
            .where(eq(refreshTokens.refreshToken, refreshToken.refreshToken!))
        return result.length <= 0
    }

    // Fetch refresh token entity from storage by refresh token
    async getByRefreshToken(refreshTokenToken: string): Promise<OAuthToken> {
        const result = await db
            .select()
            .from(refreshTokens)
            .where(eq(refreshTokens.refreshToken, refreshTokenToken))
        if (result.length > 0) {
            return {
                accessToken: 'NOT STORED',
                accessTokenExpiresAt: result[0].expiresAt, // also not stored, but not important
                refreshToken: result[0].refreshToken,
                refreshTokenExpiresAt: result[0].expiresAt,
                client: await new ClientRepository().getByIdentifier(
                    result[0].clientId,
                ),
                user: await new UserRepository().getUserByCredentials(
                    result[0].userId,
                ),
                scopes: await new ScopeRepository().getAllByIdentifiers([
                    result[0].scope,
                ]),
            }
        }
        throw new Error('refresh token not found')
    }
}

export class UserRepository implements OAuthUserRepository {
    // Fetch user entity from storage by identifier. A provided password may
    // be used to validate the users credentials. Grant type and client are provided
    // for additional checks if desired
    async getUserByCredentials(
        identifier: string,
        password?: string,
        grantType?: GrantIdentifier,
        client?: OAuthClient,
    ): Promise<OAuthUser | undefined> {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.id, identifier))
        if (password) {
            return undefined
        }
        if (result.length > 0) {
            return {
                id: result[0].id,
                name: result[0].name,
            }
        }
    }

    async extraAccessTokenFields(
        user: OAuthUser,
    ): Promise<ExtraAccessTokenFields | undefined> {
        //const userData = (new UserRepository).getUserByCredentials(user.id)
        return {
            name: user.name,
        }
    }
}

export class ClientRepository implements OAuthClientRepository {
    // Fetch client entity from storage by client_id
    async getByIdentifier(clientId: string): Promise<OAuthClient> {
        if (clientId === 'BeingWellApp') {
            return {
                id: 'BeingWellApp',
                name: 'App for BeingWell',
                redirectUris: [
                    'exp://192.168.178.150:8081',
                    'exp://192.168.0.247:8081',
                    'exp://172.17.119.171:8081',
                    'exp://172.20.10.3:8081',
                    'http://localhost',
                ],
                allowedGrants: ['authorization_code', 'refresh_token'],
                scopes: [{ name: defaultScope }],
                secret: undefined,
            }
        }
        throw new Error('client not known')
    }

    // check the grant type and secret against the client
    async isClientValid(
        grantType: GrantIdentifier,
        client: OAuthClient,
        clientSecret?: string,
    ): Promise<boolean> {
        if (client.secret && client.secret !== clientSecret) {
            return false
        } else if (!client.allowedGrants.includes(grantType)) {
            return false
        }
        return true
    }
}

export class ScopeRepository implements OAuthScopeRepository {
    // Find all scopes by scope names
    async getAllByIdentifiers(scopeNames: string[]): Promise<OAuthScope[]> {
        const scopes: OAuthScope[] = []
        for (const scopeName of scopeNames) {
            scopes.push({
                name: scopeName,
            })
        }
        return scopes
    }

    // Scopes have already been validated against the client, if you arent
    // doing anything fancy with scopes, you can just `return scopes`,
    // Otherwise, now is your chance to add or remove any final scopes
    // after they have already been validated against the client scopes
    async finalize(
        scopes: OAuthScope[],
        identifier: GrantIdentifier,
        client: OAuthClient,
        user_id?: string,
    ): Promise<OAuthScope[]> {
        return scopes
    }
}
