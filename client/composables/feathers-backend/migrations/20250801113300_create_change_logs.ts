import { Knex } from "knex";

// migrations/YYYYMMDD_create_change_logs.ts
export async function up(knex: Knex):Promise<void> {
  await knex.schema.createTable('change_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('player_id').notNullable();
    table.uuid('user_id').notNullable();
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    table.string('action').notNullable(); // 'UPDATE', 'CREATE', 'DELETE'
    table.string('field_name').notNullable();
    table.text('old_value');
    table.text('new_value');
    table.jsonb('context');
  });
}

export async function down(knex: Knex) : Promise<void>{
  await knex.schema.dropTable('change_logs');
}
