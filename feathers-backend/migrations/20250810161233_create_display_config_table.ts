import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('displayConfig', (table) => {
    table.increments('id').primary();
    table.string('displaySection').notNullable(); // light / dark
    table.string('height').notNullable(); // e.g., grid / list
    table.string('width').notNullable() // show/hide
    table.string('priority').nullable(); // optional extra config
    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('displayConfig');
}