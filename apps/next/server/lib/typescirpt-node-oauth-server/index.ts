import {
  AuthorizationServer,
  EnableGrant,
  EnableableGrants,
  JwtService,
  OAuthAuthCodeRepository,
  OAuthUserRepository,
  OAuthException,
  DateInterval,
} from '@jmondi/oauth2-server'
import {
  ClientRepository,
  ScopeRepository,
  TokenRepository,
  UserRepository,
  AuthCodeRepository,
} from './repositories'
import { OAuthResponse } from '@jmondi/oauth2-server/src/responses/response'
import { redirect } from 'next/navigation'

export const ACCESS_TOKEN_INTERVAL = new DateInterval('1min')
export const REFRESH_TOKEN_INTERVAL = new DateInterval('5y')

const userRepository: OAuthUserRepository = new UserRepository()
const authCodeRepository: OAuthAuthCodeRepository = new AuthCodeRepository()
const authCodeGrantEnabled: EnableableGrants = {
  grant: 'authorization_code',
  authCodeRepository: authCodeRepository,
  userRepository: userRepository,
}
export const authCodeGrant: EnableGrant = authCodeGrantEnabled

export const jwtService = new JwtService(process.env.OAUTH_SERVER_SECRET)

/**
 * Important: Implemented in a way that access tokens are short living self encoded JWTs. They are not saved in the db
 * and can not be revoked. Only refresh tokens can be revoked.
 *
 * Important: The revoke endpoint only revokes a refresh token. The associated access token is still valid, but expires
 * very soon.
 *
 * Important: If a refresh token is used to issue a new access token, the old refresh token gets invalided and a new
 * refresh tokens gets created.
 *
 * Important: Bearer Auth Token contains access_token_id, exp, user_id as sub and other user defined fields but no refresh_token_id!
 * Important: Bearer Refresh Token contains access_token_id, refresh_token_id, exp, user_id, ...
 */
export const authorizationServer = new AuthorizationServer(
  new ClientRepository(),
  new TokenRepository(),
  new ScopeRepository(),
  jwtService,
  {}, // optional configuration
)
// @ts-ignore
authorizationServer.enableGrantType(authCodeGrant, ACCESS_TOKEN_INTERVAL)
authorizationServer.enableGrantType('refresh_token', ACCESS_TOKEN_INTERVAL)

export function handleResponse(oauthResponse: OAuthResponse): Response {
  if (oauthResponse.status === 302) {
    if (!oauthResponse.headers.location)
      throw new Error('missing redirect location')
    redirect(oauthResponse.headers.location)
  } else {
    return new Response(JSON.stringify(oauthResponse.body), {
      status: oauthResponse.status,
      headers: oauthResponse.headers,
    })
  }
}

export function handleError(e: unknown | OAuthException): Response | undefined {
  if (e instanceof OAuthException) {
    return new Response(
      JSON.stringify({
        status: e.status,
        message: e.message,
      }),
      {
        status: e.status,
      },
    )
  }
  throw e
}
