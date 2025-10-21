import { AdminGetUserCommand, AdminGetUserCommandInput, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import express, { NextFunction, Request, Response, Router } from 'express';
import { config } from '../config/config';
import { JwtVerifier } from '../middleware/JwtVerifier';
import { services } from '../services/services';
import { CustomRequest } from '../types/ApiTypes';
import { UserCreationData } from '../types/UserTypes';

export class UserController {
    router: Router;
    private static cognitoClient = new CognitoIdentityProviderClient({
        region: config.awsUser.region
    });
    constructor() {
        this.router = express.Router();
        // this.router.post('/', this.createUser.bind(this));
        this.router.get('/', JwtVerifier.verifyCollabToken, this.getUserByCollabToken.bind(this));
        // this.router.get('/email/:email', JwtVerifier.verifyCollabToken, this.getUserByEmail.bind(this));
        // this.router.get('/:userId', JwtVerifier.verifyCollabToken, this.getUserById.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/user', this.router);
    }

    async getUserByCollabToken(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).userId;
        const user = await services.userService.getUserById(userId);
        if (user === null) {
            res.status(404).json({
                message: `User with ID ${userId} not found.`
            });
        } else {
            res.status(200).json(user);
        }
    }

    // unused atm
    private async userSignedUp(email: string): Promise<boolean> {
        try {
            const input: AdminGetUserCommandInput = {
                UserPoolId: config.awsUser.cognitoUserPoolId,
                Username: email
            };
            const command = new AdminGetUserCommand(input);
            const cognitoRes = await UserController.cognitoClient.send(command);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // unused atm
    async createUser(req: Request, res: Response, next: NextFunction) {
        const requestBody = req.body;
        const userData: UserCreationData = {
            cognitoId: requestBody.cognitoId,
            email: requestBody.email,
            firstName: requestBody.givenName,
            lastName: requestBody.familyName
        };
        const userSignedUp = await this.userSignedUp(userData.email);
        if (userSignedUp) {
            const user = await services.userService.createUser(userData);
            res.status(201).json(user);
        } else {
            res.status(403).json({
                message: 'User has not signed up. Forbidden.'
            });
        }
    }
}
