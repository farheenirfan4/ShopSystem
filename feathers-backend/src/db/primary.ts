import knex from 'knex'

export const primaryDb = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '2115412',
    database: 'postgres' // this is your second DB
  }
})
