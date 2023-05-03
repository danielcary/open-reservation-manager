import express from 'express';
import path from 'path';
import { parse as authParse } from 'basic-auth';
import * as dotenv from 'dotenv';
dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../", "../", "dist")));
app.use(express.static(path.join(__dirname, "../", "../", "public")));


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


    res.sendStatus(401);
    return;
});

app.get('/login', (_req, res) => {
    res.sendStatus(200);
});



app.listen(port, () => console.log(`listening on ${port}`))