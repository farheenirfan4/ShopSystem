// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    postgresqlClient: Knex
  }
}

export const postgresql1 = (app: Application) => {
  const config = app.get('postgresql')
  const db = knex(config!)

  app.set('postgresqlClient', db)
}

export const postgresql = (app: Application) => {
  const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Required for Neon
    }
  })

  app.set('postgresqlClient', db)
}

