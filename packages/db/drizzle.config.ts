import type { Config } from 'drizzle-kit'

export default {
    schema: './schema',
    driver: 'mysql2',
    out: './migrations',
    tablesFilter: ['bwell_*'],
    breakpoints: true,
} satisfies Config
