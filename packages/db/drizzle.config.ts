import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({
  path: "../../.env",
});

if (!process.env.DATABASE_HOST) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./schema",
  driver: "mysql2",
  dbCredentials: {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST!,
    port: 3306,
    database: process.env.DATABASE!,
  },
  tablesFilter: ["bwell_*"],
  breakpoints: true
} satisfies Config;
