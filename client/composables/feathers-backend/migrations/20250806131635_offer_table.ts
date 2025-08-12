import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('offers')

await knex.schema.createTable('offers', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()')) // or use uuid_generate_v4()

    table.string('title').notNullable()
    table.text('description').notNullable()
    table.string('price').notNullable() // string due to regex pattern
    table.string('discountPercentage').notNullable() // string due to pattern

    table.specificType('promotionalTags', 'text[]').notNullable() // array of strings
    table.specificType('productId', 'text[]').notNullable() // array of strings

    table.uuid('personaId').notNullable()
    table.uuid('displayConfigureId').notNullable()
    table.enu('repeatPatterns', ['none', 'daily', 'weekly', 'monthly']).notNullable()

    table.string('createdBy').notNullable()
    table.string('upateddBy').notNullable()

    table.boolean('isDeleted').defaultTo(false)

    table.timestamp('startDateUTC', { useTz: true }).notNullable()
    table.timestamp('endDateUTC', { useTz: true }).notNullable()

    table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updatedAt', { useTz: true }).defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex) : Promise<void>{
  await knex.schema.dropTable('offers')
}

