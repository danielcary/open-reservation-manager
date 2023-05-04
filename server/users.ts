import { HttpStatusCode } from 'axios';
import { Router } from 'express';
import { pbkdf2Sync, randomBytes } from 'crypto';
import * as yup from 'yup';

import { loadDB } from './db';

const route = Router();

export function hashPassword(pass: string, salt: string): string {
    let derivedKey = pbkdf2Sync(pass, salt, 10000, 64, 'sha512');
    return derivedKey.toString('hex');
}

// only admin account is allowed access
route.use((_req, res, next) => {
    if (res.locals.auth.name == "admin") {
        next();
    } else {
        res.sendStatus(401);
    }
});

route.get('/', (_req, res) => {
    loadDB().then(knex => {
        return knex('users').select(['id', 'name']);
    }).then(vals => {
        res.json(vals);
    });
});

const addUserBody = yup.object({
    name: yup.string().max(255).required(),
    pass: yup.string().required(),
});

route.post('/', (req, res) => {
    if (!addUserBody.isValidSync(req.body)) {
        res.status(HttpStatusCode.BadRequest);
        res.send('Bad name or password');
        return;
    }

    let user = addUserBody.cast(req.body);

    loadDB().then(knex => {
        return knex('users').select('*').where('name', user.name);
    }).then(vals => {
        if (vals.length != 0) {
            res.status(HttpStatusCode.BadRequest);
            res.send('Username already taken!');
            return;
        }

        let salt = randomBytes(8).toString('hex');
        let hashedPassword = hashPassword(user.pass, salt);

        loadDB().then(knex => {
            return knex('users').insert({
                name: user.name,
                hashedPassword: hashedPassword,
                salt: salt,
            });
        }).then(() => {
            res.sendStatus(HttpStatusCode.Created);
        });
    });
});

route.delete('/:id', (req, res) => {
    loadDB().then(knex => {
        return knex('users').where('id', req.params.id).delete();
    }).then(num => {
        if (num == 1) {
            res.sendStatus(HttpStatusCode.Ok);
        } else {
            // Unknown or bad user ID 
            res.sendStatus(HttpStatusCode.BadRequest);
        }
    }).catch(err => {
        console.error(err);
        res.sendStatus(HttpStatusCode.InternalServerError);
    });
});

export default route;
