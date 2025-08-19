import knex from 'knex';
import dotenv from "dotenv";

export const primaryDb1 = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '2115412',
    database: 'postgres' // this is my second DB
  }
})

export const primaryDb = knex({
  client: "pg",
  connection: {
    connectionString: process.env.NEON_DB1_URL, // your first Neon DB
    ssl: { rejectUnauthorized: false }
  }
});
