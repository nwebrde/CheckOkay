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

export enum ChannelType {
    EMAIL = 'EMAIL',
    PUSH = 'PUSH'
}

export const notificationChannels = mySqlTable(
    'notificationChannel',
    {
        userId: varchar('userId', { length: 255 })
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),
        address: varchar('address', { length: 255 }).notNull(),
        id: int('id').autoincrement().notNull().primaryKey(),
        type: mysqlEnum('type', [
            ChannelType.EMAIL,
            ChannelType.PUSH,
        ]).notNull(),
    }
)

export const notificationChannelRelation = relations(notificationChannels, ({ one }) => ({
    user: one(users, {
        fields: [notificationChannels.userId],
        references: [users.id],
    }),
}))


