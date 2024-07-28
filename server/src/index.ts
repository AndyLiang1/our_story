import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { initDb } from './db';
import { config } from './config/config';

import { getAllUsers } from './repositories/userRepo'; // just to test
import axios from 'axios';

const app: Express = express();
app.use(cors());
app.use(express.json())

const port = config.server.port || 3000;

const getData = async () => {
    const resp = await axios.get(`https://${process.env.TIPTAP_APP_ID}.collab.tiptap.cloud/api/documents/test_doc?format=json`, {
        headers: {
            Authorization: process.env.TIPTAP_SECRET
        },
        responseType: 'arraybuffer'
    });
    const bufferData = Buffer.from(resp.data);
    const jsonData = JSON.parse(bufferData.toString('utf-8'));
    return jsonData;
};

const init = async () => {
    await initDb();
    app.listen(port, async () => {
        console.log(`Server is running at http://localhost:${port}`);
        await getAllUsers(); // just to test
    });

    app.get('/getData', async (req: Request, res: Response) => {
        try {
            const data = await getData();
            console.log(data)
            res.send(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching data' });
        }
    });

    app.get('/', (req: Request, res: Response) => {
        res.json({ message: 'Hello Andy and Arya!' });
    });
};

init();
