import { relations, sql } from 'drizzle-orm'
import {
    timestamp,
    varchar,
    primaryKey,
    mysqlEnum,
} from 'drizzle-orm/mysql-core'

import { mySqlTable } from './_table'
import { users } from './auth'
import { GuardType } from 'next-app/server/lib/types/gaurd'

export const guards = mySqlTable(
    'guards',
    {
        guardedUserId: varchar('guardedUserId', { length: 255 })
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),
        guardUserId: varchar('guardUserId', { length: 255 })
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),
        priority: mysqlEnum('priority', [
            GuardType.IMPORTANT,
            GuardType.BACKUP,
        ]).notNull(),
        createdAt: timestamp('created_at')
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({
                columns: [table.guardUserId, table.guardedUserId],
            }),
        }
    },
)

export const guardsRelations = relations(guards, ({ one }) => ({
    guardUser: one(users, {
        fields: [guards.guardUserId],
        references: [users.id],
        relationName: 'guardUser',
    }),
    guardedUser: one(users, {
        fields: [guards.guardedUserId],
        references: [users.id],
        relationName: 'guardedUser',
    }),
}))
