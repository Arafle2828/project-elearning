import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('books', table => {
    table.bigIncrements('id').primary();
    table.string('title').notNullable();
    table.string('slug').notNullable().unique();
    table.string('author').notNullable();
    table.string('isbn').nullable().unique();
    table.text('description').nullable();
    table.string('category').notNullable();
    table.decimal('price', 10, 2).notNullable().defaultTo(0);
    table.text('cover_image').nullable();
    table.text('file_path').nullable();
    table.date('published_date').nullable();
    table.integer('page_count').nullable();
    table.string('language', 10).notNullable().defaultTo('id');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: true }).nullable();
    
    // Indexes
    table.index(['category']);
    table.index(['author']);
    table.index(['is_active']);
    table.index(['language']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('books');
}
