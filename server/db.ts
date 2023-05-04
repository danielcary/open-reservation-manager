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

   // db('info').insert({ schemaVersion: 1 });

    await db.schema.createTable('users', table => {
        table.increments('id');
        table.string('name', 255).notNullable();
        table.string('hashedPassword', 128).notNullable();
        table.string('salt', 16).notNullable();
    });

    await db.destroy();

    return knex(dbConfig);
}

