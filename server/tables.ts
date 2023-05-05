import { HttpStatusCode } from 'axios';
import { Router } from 'express';
import * as yup from 'yup';

import { loadDB } from './db';

const route = Router();

/*** Groupings ***/

route.get('/', (_req, res) => {
    loadDB().then(knex => {
        return knex('tableGroups').select(['id', 'name', 'desc']);
    }).then(vals => {
        res.json(vals);
    });
});

const groupingBody = yup.object({
    name: yup.string().max(255).required(),
    desc: yup.string().max(512).default(""),
})

route.post('/', (req, res) => {
    if (!groupingBody.isValidSync(req.body)) {
        res.status(HttpStatusCode.BadRequest);
        res.send('Bad name or desc');
        return;
    }

    let grouping = groupingBody.cast(req.body);

    loadDB().then(knex => {
        return knex('tableGroups').insert({
            name: grouping.name,
            desc: grouping.desc,
        });
    }).then(() => {
        res.sendStatus(HttpStatusCode.Created);
    });
});

route.get('/:groupId', (req, res) => {
    loadDB().then(knex => {
        return knex('tableGroups').select(['id', 'name', 'desc'])
            .where('id', req.params.groupId);
    }).then(val => {
        res.json(val);
    });
});

route.patch('/:groupId', (req, res) => {
    if (!groupingBody.isValidSync(req.body)) {
        res.status(HttpStatusCode.BadRequest);
        res.send('Bad name or desc');
        return;
    }

    let grouping = groupingBody.cast(req.body);

    loadDB().then(knex => {
        return knex('tableGroups').where('id', req.params.groupId)
            .update({
                name: grouping.name,
                desc: grouping.desc,
            });
    }).then((num) => {
        if (num == 1) {
            res.sendStatus(HttpStatusCode.Created);
        } else {
            res.sendStatus(HttpStatusCode.BadRequest);
        }
    });
});

route.delete('/:groupId', (req, res) => {
    // TODO: make sure related tables are deleted
    loadDB().then(knex => {
        return knex('tableGroups').where('id', req.params.groupId).delete();
    }).then((num) => {
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


/*** Tables ***/

route.get('/:groupId/tables', (req, res) => {
    loadDB().then(knex => {
        return knex('tables').select(['id', 'name', 'capacity'])
            .where('group_id', req.params.groupId);
    }).then(vals => {
        res.json(vals);
    });
});

const tablesBody = yup.object({
    name: yup.string().max(255).required(),
    capacity: yup.number().positive().integer().required(),
})

route.post('/:groupId/tables', (req, res) => {
    if (!tablesBody.isValidSync(req.body)) {
        res.status(HttpStatusCode.BadRequest);
        res.send('Bad name or capacity');
        return;
    }

    let table = tablesBody.cast(req.body);

    loadDB().then(knex => {
        return knex('tables').insert({
            name: table.name,
            capacity: table.capacity,
        });
    }).then(() => {
        res.sendStatus(HttpStatusCode.Created);
    });
});



export default route;
