import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('personas-config', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name')
    table.boolean('forPayingUsers'),
    table.integer('maxLevel'),
    table.integer('minLevel'),
    table.integer('maxMmr'),
    table.integer('minMmr'),
    table.integer('maxDeposits'),
    table.integer('minDeposits'),
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
  })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('personas_config')
}

