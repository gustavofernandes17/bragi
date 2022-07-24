import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    return knex.schema.createTable('history', (table) => {
        table.text('id')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
        table.text('filename')
        table.text('artist')
        table.text('artwork_url')
        table.text('playlist')
        table.text('duration')
        table.text('title')
        table.text('cid')
        table.text('youtube_url')
        table.text('streaming_url')
    })

}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('history')
}

