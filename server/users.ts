import { HttpStatusCode } from 'axios';
import { Router } from 'express';
import { pbkdf2Sync, randomBytes } from 'crypto';
import * as yup from 'yup';

import { loadDB } from './db';

const route = Router();

// only admin account can access
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
        res.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    let user = addUserBody.cast(req.body);

    let salt = randomBytes(8).toString('hex');
    let hashedPassword = pbkdf2Sync(user.pass, salt, 10000, 64, 'sha512').toString('hex');

    loadDB().then(knex => {
        return knex('users').insert({
            name: user.name,
            hashedPassword: hashedPassword,
            salt: salt,
        });
    }).then(() => {
        res.sendStatus(HttpStatusCode.Created);
    })
});

const patchUserBody = yup.object({
    pass: yup.string().required(),
});

route.patch('/:id', (req, res) => {
    if (!patchUserBody.isValidSync(req.body)) {
        res.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    let user = patchUserBody.cast(req.body);

    let salt = randomBytes(8).toString('hex');
    let hashedPassword = pbkdf2Sync(user.pass, salt, 10000, 64, 'sha512').toString('hex');

    loadDB().then(knex => {
        return knex('users').where('id', req.params.id).update({
            hashedPassword: hashedPassword,
            salt: salt,
        });
    }).then(() => {
        res.sendStatus(HttpStatusCode.Ok);
    }).catch(err => {
        console.error(err);
        res.sendStatus(HttpStatusCode.InternalServerError);
    });
});

route.delete('/:id', (req, res) => {

    loadDB().then(knex => {
        return knex('users').where('id', req.params.id).delete();
    }).then(() => {
        res.sendStatus(HttpStatusCode.Ok);
    }).catch(err => {
        console.error(err);
        res.sendStatus(HttpStatusCode.InternalServerError);
    });
});

export default route;
