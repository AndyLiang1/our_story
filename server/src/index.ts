import express, { Express, Request, Response } from 'express';
import { initDb } from './db';
import {config} from "./config/config"

import { getAllUsers } from './repositories/userRepo'; // just to test

const app: Express = express();
const port = config.server.port || 3000;

const init = async () => {
    await initDb();
    app.listen(port, async() => {
        console.log(`Server is running at http://localhost:${port}`);
        await getAllUsers() // just to test
    });

    app.get('/', (req: Request, res: Response) => {
        res.send('Hello Andy and Arya!');
    });
};

init();
