import express, { Request, Response, NextFunction, Router } from 'express';
import {services} from "../services/services"
import { UserData } from '../types/UserTypes';
import { CustomRequest, JwtVerifier } from '../middleware/JwtVerifier';

export class UserController {
    router: Router
    constructor() {
        this.router = express.Router()
        this.router.use(JwtVerifier.verifyCollabToken)
        // the this.login.bind(this) is basically saying
        // when I hit /api/users in a get request, I am going 
        // to call the login function 
        // https://stackoverflow.com/questions/40018472/implement-express-controller-class-with-typescript
        this.router.post('/', this.createUser.bind(this))
        this.router.get('/', this.getAllUsers.bind(this))
        this.router.get('/email/:email', this.getUserByEmail.bind(this))
        this.router.get('/:userId', this.getUserById.bind(this))
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/user', this.router)
    }


    async createUser(req: Request, res: Response, next: NextFunction) {
        const requestBody = req.body
        const userData: UserData = {
            cognitoId: requestBody.cognitoId,
            email: requestBody.email,
            firstName: requestBody.givenName,
            lastName: requestBody.familyName
        }
        const user = await services.userService.createUser(userData)
        res.status(201).json(user)

    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        const users = await services.userService.getAllUsers()
        res.status(200).json(users)

    }

    async getUserByEmail(req: Request, res: Response, next: NextFunction) {
        const { email } = req.params
        const user = await services.userService.getUserByEmail(email)
        console.log(`user with email ${email}: ${JSON.stringify(user)}`)

        if (user === null) {
            res.status(404).json({
                message: `User with email ${email} not found.`
            })
        } else {
            res.status(200).json(user)
        }

    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params
        const user = await services.userService.getUserById(userId)
        if (user === null) {
            res.status(404).json({
                message: `User with ID ${userId} not found.`
            })
        } else {
            res.status(200).json(user)
        }
    
    }
    
}