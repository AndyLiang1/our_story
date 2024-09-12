import cors from 'cors';
import express, { Express } from 'express';
import { config } from './config/config';
import { initDb } from './db';

import 'express-async-errors';
import { DocumentController } from './controllers/DocumentController';
import { UserController } from './controllers/UserController';
import { ImageController } from './controllers/ImageController';
import { errorHandler } from './middleware/errorHandler';
import { JwtVerifier } from './middleware/JwtVerifier';

const app: Express = express();
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const port = config.server.port || 3000;

const init = async () => {
    await initDb();
    app.listen(port, async () => {
        console.log(`Server is running at http://localhost:${port}`);
    });

    app.get('/api/auth/getCollabToken', JwtVerifier.verifyAwsCognitoJwt, JwtVerifier.generateTipTapCollabToken);
    new UserController().initRoutes(app);
    new DocumentController().initRoutes(app);
    new ImageController().initRoutes(app);
    app.use(errorHandler);
};

init();
