import { AdminGetUserCommand, AdminGetUserCommandInput, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import express, { NextFunction, Request, Response, Router } from 'express';
import { config } from '../config/config';
import { JwtVerifier } from '../middleware/JwtVerifier';
import { services } from '../services/services';
import { UserData } from '../types/UserTypes';

export class UserController {
    router: Router;
    private static cognitoClient = new CognitoIdentityProviderClient({
        region: config.awsCognito.region
    });
    constructor() {
        this.router = express.Router();
        // the this.login.bind(this) is basically saying
        // when I hit /api/users in a get request, I am going
        // to call the login function
        // https://stackoverflow.com/questions/40018472/implement-express-controller-class-with-typescript
        this.router.post('/', this.createUser.bind(this));
        this.router.get('/', JwtVerifier.verifyCollabToken, this.getAllUsers.bind(this));
        this.router.get('/email/:email', JwtVerifier.verifyCollabToken, this.getUserByEmail.bind(this));
        this.router.get('/:userId', JwtVerifier.verifyCollabToken, this.getUserById.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/user', this.router);
    }

    private async userSignedUp(email: string): Promise<boolean> {
        try {
            const input: AdminGetUserCommandInput = {
                UserPoolId: config.awsCognito.userPoolId,
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

    async createUser(req: Request, res: Response, next: NextFunction) {
        const requestBody = req.body;
        const userData: UserData = {
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

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        const users = await services.userService.getAllUsers();
        res.status(200).json(users);
    }

    async getUserByEmail(req: Request, res: Response, next: NextFunction) {
        const { email } = req.params;
        const user = await services.userService.getUserByEmail(email);
        console.log(`user with email ${email}: ${JSON.stringify(user)}`);

        if (user === null) {
            res.status(404).json({
                message: `User with email ${email} not found.`
            });
        } else {
            res.status(200).json(user);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;
        const user = await services.userService.getUserById(userId);
        if (user === null) {
            res.status(404).json({
                message: `User with ID ${userId} not found.`
            });
        } else {
            res.status(200).json(user);
        }
    }
}
