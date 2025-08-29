import cors from 'cors';
import express, { Express } from 'express';
import { config } from './config/config';
import { initDb } from './db';

import { Server } from '@hocuspocus/server';
import 'express-async-errors';
import { DocumentController } from './controllers/DocumentController';
import { DocumentOwnerController } from './controllers/DocumentOwnerController';
import { ImageController } from './controllers/ImageController';
import { PartnerController } from './controllers/PartnerController';
import { UserController } from './controllers/UserController';
import { errorHandler } from './middleware/errorHandler';
import { JwtVerifier } from './middleware/JwtVerifier';
import { syncDocuments } from './scheduled-jobs/syncDocuments';

const app: Express = express();
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const init = async () => {
    await initDb();
    
    const hocuspocusServer = new Server();
    hocuspocusServer.listen(config.hocuspocusServer.port, () => {
        console.log('Hocus pocus server is listening!')
    });

    app.listen(config.webServer.port, () => {
        console.log('Web server is listening!');
    });

    app.get('/api/auth/collabTokens', JwtVerifier.verifyAwsCognitoJwt, JwtVerifier.generateTipTapCollabToken);
    new UserController().initRoutes(app);
    new DocumentController().initRoutes(app);
    new ImageController().initRoutes(app);
    new PartnerController().initRoutes(app);
    new DocumentOwnerController().initRoutes(app);
    app.use(errorHandler);

    syncDocuments();
};

init();
