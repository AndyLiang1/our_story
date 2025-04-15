import cors from 'cors';
import express, { Express } from 'express';
import { config } from './config/config';
import { initDb } from './db';

import 'express-async-errors';
import { DocumentController } from './controllers/DocumentController';
import { DocumentOwnerController } from './controllers/DocumentOwnerController';
import { ImageController } from './controllers/ImageController';
import { PartnerController } from './controllers/PartnerController';
import { UserController } from './controllers/UserController';
import { errorHandler } from './middleware/errorHandler';
import { JwtVerifier } from './middleware/JwtVerifier';
import { syncDocuments } from './scheduled-jobs/syncDocuments';
import { pingTipTap } from './scheduled-jobs/tiptapPinger';

const app: Express = express();
app.use(cors());

app.use(express.json());

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
    new PartnerController().initRoutes(app);
    new DocumentOwnerController().initRoutes(app);
    app.use(errorHandler);

    syncDocuments();
    pingTipTap();
};

init();
