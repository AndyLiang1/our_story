import express, { NextFunction, Request, Response, Router } from 'express';
import { JwtVerifier } from '../middleware/JwtVerifier';
import { services } from '../services/services';

export class PartnerController {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.router.use(JwtVerifier.verifyCollabToken);
        this.router.post('/', this.createPartners.bind(this));
        this.router.delete('/', this.deletePartner.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/partners', this.router);
    }

    async createPartners(req: Request, res: Response, next: NextFunction) {
        const { userId, partnerEmail } = req.body;
        try {
            const result = await services.partnerService.createPartner(userId, partnerEmail);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async deletePartner(req: Request, res: Response, next: NextFunction) {
        const { userId, partnerEmail } = req.body;
        try {
            const result = await services.partnerService.deletePartners(userId, partnerEmail);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}
