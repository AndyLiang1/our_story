import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { initDb } from './db';
import { config } from './config/config';

import { getAllUsers } from './repositories/UserRepo'; // just to test

const app: Express = express();
app.use(cors());

const port = config.server.port || 3000;

const init = async () => {
    await initDb();
    app.listen(port, async () => {
        console.log(`Server is running at http://localhost:${port}`);
        await getAllUsers(); // just to test
    });

    app.get('/', async (req: Request, res: Response) => {
        const data = await getAllUsers(); // just to test
        res.json(data);
        // res.json({ message: 'Hello Andy and Arya!' });
    });
};

init();
