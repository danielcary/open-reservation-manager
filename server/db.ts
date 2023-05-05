import knex, { Knex } from 'knex';
import fs from 'fs';

const dbFilename = process.env.DB_FILE || "./db.sqlite";

const dbConfig: Knex.Config = {
    client: 'better-sqlite3',
    connection: {
        filename: dbFilename
    },
    useNullAsDefault: true,
    // pool: {
    //     afterCreate: (conn, cb) =>
    //         conn.run('PRAGMA foreign_keys = ON', cb)
    // }
};

// interface User {
//     id: number;
//     name: string;
//     hashedPassword: string;
// }

// interface Tables {
//     users: User;
// }

export async function loadDB(): Promise<Knex> {

    if (fs.existsSync(dbFilename)) {
        return knex(dbConfig);
    }

    // Create DB otherwise
    const db = knex(dbConfig);

    await db.schema.createTable('info', table => {
        table.integer('schemaVersion');
    });

    await db('info').insert({ schemaVersion: 1 });

    await db.schema.createTable('users', table => {
        table.increments('id');
        table.string('name', 255).notNullable();
        table.string('hashedPassword', 128).notNullable();
        table.string('salt', 16).notNullable();
    });

    await db.schema.createTable('events', table => {
        table.increments('id');
        table.string('name', 255).notNullable();
        table.datetime('startTime').notNullable();
        table.smallint('notificationType').notNullable();
        table.boolean('sms').notNullable();
        table.boolean('email').notNullable();
        table.integer('notificationTime').notNullable();
    });

    await db.schema.createTable('tableGroups', table => {
        table.increments('id');
        table.string('name', 255).notNullable();
        table.string('desc', 512).notNullable();
    });

    await db.schema.createTable('tables', table => {
        table.increments('id');
        table.string('name', 128);
        table.integer('capacity').notNullable();
        table.integer('group_id').unsigned();

        table.foreign('group_id').references('id').inTable('tableGroups');
    });

    await db.destroy();

    return knex(dbConfig);
}

