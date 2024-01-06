import { mySqlTable } from './_table'
import { timestamp, varchar, mysqlEnum } from 'drizzle-orm/mysql-core'
import { users } from './auth'
import { sql } from 'drizzle-orm'

export const authCodes = mySqlTable('authCodes', {
    authCode: varchar('authCode', { length: 255 }).notNull().primaryKey(),
    clientId: varchar('clientId', { length: 255 }).notNull(),
    userId: varchar('userId', { length: 255 })
        .notNull()
        .references(() => users.id, {
            onDelete: 'cascade',
            onUpdate: 'cascade',
        }),
    scope: varchar('scope', { length: 255 }).notNull().default('all'),
    codeChallenge: varchar('codeChallenge', { length: 255 }).notNull(),
    codeChallengeMethod: mysqlEnum('codeChallengeMethod', [
        'plain',
        'S256',
    ]).notNull(),
    redirectUri: varchar('redirectUri', { length: 255 }),
    issuedAt: timestamp('issuedAt')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
})

export const refreshTokens = mySqlTable('refreshTokens', {
    refreshToken: varchar('refreshToken', { length: 255 })
        .notNull()
        .primaryKey(),
    clientId: varchar('clientId', { length: 255 }).notNull(),
    userId: varchar('userId', { length: 255 })
        .notNull()
        .references(() => users.id, {
            onDelete: 'cascade',
            onUpdate: 'cascade',
        }),
    scope: varchar('scope', { length: 255 }).notNull().default('all'),
    issuedAt: timestamp('issuedAt')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
})
