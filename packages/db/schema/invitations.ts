import {
    time,
    varchar,
    date,
    primaryKey,
    mysqlEnum,
    int,
    serial,
} from 'drizzle-orm/mysql-core'

import { mySqlTable } from './_table'
import { users } from './auth'
import { relations, sql } from 'drizzle-orm'
import { timestamp } from 'drizzle-orm/mysql-core'

export const invitations = mySqlTable('invitations', {
    code: varchar('code', { length: 255 }).notNull().primaryKey(),
    guardedUserId: varchar('guardedUserId', { length: 255 })
        .notNull()
        .references(() => users.id, {
            onDelete: 'cascade',
            onUpdate: 'cascade',
        }),
    createdAt: timestamp('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
})

export const invitationsRelations = relations(invitations, ({ one }) => ({
    guardedUser: one(users, {
        fields: [invitations.guardedUserId],
        references: [users.id],
    })
}))
