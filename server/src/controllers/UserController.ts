import express, { Request, Response, NextFunction, Router } from 'express';
import {services} from "../services/services"
class UserController {
    router: Router
    constructor() {
        this.router = express.Router()
        // the this.login.bind(this) is basically saying
        // when I hit /api/users in a get request, I am going 
        // to call the login function 
        // https://stackoverflow.com/questions/40018472/implement-express-controller-class-with-typescript
        this.router.post('/login', this.login.bind(this))
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/users', this.router)
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body
            const response = await services.userService.login(userData)
        } catch (err) {
            next(err)
        }
    }

    
}