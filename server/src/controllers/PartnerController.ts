import express, { NextFunction, Request, Response, Router } from 'express';
import { BadRequestError, NotFoundError } from '../helpers/ErrorHelpers';
import { JwtVerifier } from '../middleware/JwtVerifier';
import { services } from '../services/services';
import { CustomRequest } from '../types/ApiTypes';

export class PartnerController {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.router.use(JwtVerifier.verifyCollabToken);
        this.router.post('/', this.createPartners.bind(this));
        // this.router.delete('/', this.deletePartner.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/partners', this.router);
    }

    async createPartners(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).userId;
        const { partnerEmail } = req.body;
        try {
            const result = await services.partnerService.createPartner(userId, partnerEmail);
            res.status(201).json(result);
        } catch (error: any) {
            // from DB
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(409).json({
                    name: 'SequelizeUniqueConstraintError',
                    message: 'You have already tried or are partners with this user.'
                });
            }
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    name: error.name,
                    message: error.message
                });
            }
            if (error instanceof NotFoundError) {
                res.status(404).json({
                    name: error.name,
                    message: error.message
                });
            }
            next(error);
        }
    }

    // async deletePartner(req: Request, res: Response, next: NextFunction) {
    //     const userId = (req as CustomRequest).userId;
    //     const { partnerEmail } = req.body;
    //     try {
    //         const result = await services.partnerService.deletePartners(userId, partnerEmail);
    //         res.status(200).json(result);
    //     } catch (error) {
    //         console.error(error);
    //         next(error);
    //     }
    // }
}
