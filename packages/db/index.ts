// @ts-ignore
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

import * as auth from "./schema/auth";
import * as checks from "./schema/checks";
import * as guards from "./schema/guards";
import * as oauthserver from "./schema/oauthserver";

export const schema = { ...auth, ...checks, ...guards, ...oauthserver };

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

const poolConnection = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD
});

export const db = drizzle(
  poolConnection, { schema: schema, mode: "default" }
);
