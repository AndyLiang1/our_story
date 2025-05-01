import express, { NextFunction, Request, Response, Router } from 'express';
import { JwtVerifier } from '../middleware/JwtVerifier';
import { services } from '../services/services';
import { CustomRequest } from '../types/ApiTypes';

export class DocumentOwnerController {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.router.use(JwtVerifier.verifyCollabToken);
        this.router.post('/:documentId', this.shareDocument.bind(this));
        // this.router.delete('/', this.deleteDocumentOwner.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/documentOwners', this.router);
    }

    async shareDocument(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).userId;
        const { partnerEmail } = req.body;
        const { documentId } = req.params;
        try {
            const result = await services.documentOwnerService.shareDocument(documentId, userId, partnerEmail);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(409).json({
                    name: 'SequelizeUniqueConstraintError',
                    message: 'You have already shared this document with this user.'
                });
            }
            next(error);
        }
    }

    // async deleteDocumentOwner(req: Request, res: Response, next: NextFunction) {
    //     const { userId, partnerEmail } = req.body;
    //     try {
    //         const result = await services.documentOwnerService.deleteDocumentOwner(userId, partnerEmail);
    //         res.status(200).json(result);
    //     } catch (error) {
    //         console.error(error);
    //         next(error);
    //     }
    // }
}
