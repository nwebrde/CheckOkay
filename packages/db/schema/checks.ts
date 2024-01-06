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

export const checks = mySqlTable(
    'checks',
    {
        guardedUserId: varchar('guardedUserId', { length: 255 })
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),
        time: time('time')
            .notNull()
            .default(sql`'00:00' CHECK (HOUR(time) < 24)`),
        checkId: varchar('id', { length: 255 }).notNull().unique(),
        notifyId: varchar('notifyId', { length: 255 }).unique(),
        backupId: varchar('backupId', { length: 255 }).unique(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.guardedUserId, table.time] }),
        }
    },
)

export const checksRelations = relations(checks, ({ one }) => ({
    guardedUser: one(users, {
        fields: [checks.guardedUserId],
        references: [users.id],
    }),
}))
