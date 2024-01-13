const { migrate } = require('drizzle-orm/mysql2/migrator')
const { drizzle } = require('drizzle-orm/mysql2')
const { createConnection } = require('mysql2/promise')

async function runMigrate() {
    console.log('Running migrations...')

    const start = Date.now()

    let connection
    if (process.env.DATABASE_URL) {
        connection = await createConnection({
            uri: process.env.DATABASE_URL,
        })
    } else {
        connection = await createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            database: process.env.DATABASE,
            password: process.env.DATABASE_PASSWORD,
        })
    }
    const db = drizzle(connection, {
        logger: undefined /*{

                logQuery: (query) => {
                    // to remove quotes on query string, to make it more readable
                    console.log({ query: query.replace(/\"/g, '') })
                },


            },*/,
    })

    await migrate(db, { migrationsFolder: './migrations' })
    const end = Date.now()

    console.log(`✅ Migrations completed in ${end - start}ms`)

    await connection.end()
}

runMigrate().catch((err) => {
    console.error('❌ Migration failed')
    console.error(err)
    process.exit(1)
})
