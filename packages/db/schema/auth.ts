import type { AdapterAccount } from '@auth/core/adapters'
import { relations, sql } from 'drizzle-orm'
import {
    datetime,
    index,
    int,
    mysqlEnum,
    primaryKey,
    text,
    time,
    timestamp,
    varchar,
} from 'drizzle-orm/mysql-core'

import { mySqlTable } from './_table'
import { checks } from './checks'
import { guards } from './guards'
import { CheckState } from 'app/lib/types/checks'

export const users = mySqlTable('user', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerified: timestamp('emailVerified', {
        mode: 'date',
        fsp: 3,
    }).default(sql`CURRENT_TIMESTAMP(3)`),
    image: varchar('image', { length: 255 }),

    nextRequiredCheckDate: datetime('nextRequiredCheckDate'),
    lastManualCheck: datetime('lastManualCheck'),
    lastStepCheck: datetime('lastStepCheck'),
    state: mysqlEnum('state', [
        CheckState.OK,
        CheckState.WARNED,
        CheckState.BACKUP,
        CheckState.NOTIFIED,
    ])
        .notNull()
        .default(CheckState.OK),
    notifyBackupAfter: time('notifyBackupAfter')
        .notNull()
        .default(sql`'03:00' CHECK (HOUR(notifyBackupAfter) < 24)`),
    reminderBeforeCheck: time('reminderBeforeCheck')
        .notNull()
        .default(sql`'00:25' CHECK (HOUR(reminderBeforeCheck) < 24)`),
})

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    checks: many(checks),
    guards: many(guards, { relationName: 'guardedUser' }),
    guardedUsers: many(guards, { relationName: 'guardUser' }),
}))

export const accounts = mySqlTable(
    'account',
    {
        userId: varchar('userId', { length: 255 }).notNull(),
        type: varchar('type', { length: 255 })
            .$type<AdapterAccount['type']>()
            .notNull(),
        provider: varchar('provider', { length: 255 }).notNull(),
        providerAccountId: varchar('providerAccountId', {
            length: 255,
        }).notNull(),
        refresh_token: varchar('refresh_token', { length: 255 }),
        access_token: varchar('access_token', { length: 255 }),
        expires_at: int('expires_at'),
        token_type: varchar('token_type', { length: 255 }),
        scope: varchar('scope', { length: 255 }),
        id_token: text('id_token'),
        session_state: varchar('session_state', { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey(account.provider, account.providerAccountId),
        userIdIdx: index('userId_idx').on(account.userId),
    }),
)

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessions = mySqlTable(
    'session',
    {
        sessionToken: varchar('sessionToken', { length: 255 })
            .notNull()
            .primaryKey(),
        userId: varchar('userId', { length: 255 }).notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (session) => ({
        userIdIdx: index('userId_idx').on(session.userId),
    }),
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const verificationTokens = mySqlTable(
    'verificationToken',
    {
        identifier: varchar('identifier', { length: 255 }).notNull(),
        token: varchar('token', { length: 255 }).notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey(vt.identifier, vt.token),
    }),
)
