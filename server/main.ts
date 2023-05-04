import express from 'express';
import path from 'path';
import { parse as authParse } from 'basic-auth';
import * as dotenv from 'dotenv';
dotenv.config()

import UsersRoute, { hashPassword } from './users';
import EventsRoute from './events';
import { loadDB } from './db';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../", "../", "dist")));
app.use(express.static(path.join(__dirname, "../", "../", "public")));
app.use(express.json());

// auth
app.use((req, res, next) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    let auth = authParse(req.headers.authorization);
    if (!auth) {
        res.sendStatus(401);
        return;
    }

    res.locals.auth = auth;

    // admin is special user
    if (auth.name == "admin") {
        if (auth.pass == process.env.ORM_ADMIN_PW) {
            next();
            return;
        }
        res.sendStatus(401);
        return;
    }

    // check database otherwise
    loadDB().then(knex => {
        return knex('users').select(['hashedPassword', 'salt']).where('name', auth!.name);
    }).then(vals => {
        if (vals.length == 0) {
            // didn't find a matching username
            res.sendStatus(401);
            return;
        }

        let salt = vals[0].salt;
        let hashedPassword = hashPassword(auth!.pass, salt);

        if (vals[0].hashedPassword == hashedPassword) {
            next();
        } else {
            res.sendStatus(401);
        }
    }).catch(() => {
        res.sendStatus(500);
    });
});

app.get('/login', (_req, res) => {
    res.sendStatus(200);
});

app.use('/api/users', UsersRoute);
app.use('/api/events', EventsRoute);


app.listen(port, () => console.log(`listening on ${port}`))