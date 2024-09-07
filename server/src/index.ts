import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { initDb } from './db';
import { config } from './config/config';

import { UserController } from './controllers/UserController';
import { UserRepo } from './repositories/UserRepo';
import { DocumentController } from './controllers/DocumentController';
import { JwtVerifier } from './middleware/JwtVerifier';
import { errorHandler } from './middleware/ErrorHandler';
import "express-async-errors";

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

    app.get(
        "/api/auth/getCollabToken", 
        JwtVerifier.verifyAwsCognitoJwt, 
        JwtVerifier.generateTipTapCollabToken
    )
    new UserController().initRoutes(app)
    new DocumentController().initRoutes(app)
    app.use(errorHandler)
};

init();
