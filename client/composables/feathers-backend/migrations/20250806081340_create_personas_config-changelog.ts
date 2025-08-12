import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('personas-config-changelogs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('entity')
    table.string('entityId')
    table.string('action').defaultTo(true)
    table.jsonb('oldData')
    table.jsonb('newData')
    table.string('changedBy')
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
  })
    
}

export async function down(knex: Knex): Promise<void> {
}

