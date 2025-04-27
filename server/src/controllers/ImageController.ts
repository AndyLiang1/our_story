import express, { NextFunction, Request, Response, Router } from 'express';
import { JwtVerifier } from '../middleware/JwtVerifier';
import { services } from '../services/services';
import { CustomRequest } from '../types/ApiTypes';

export class ImageController {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.router.use(JwtVerifier.verifyCollabToken);
        this.router.post('/uploadUrls', this.getUploadURLS.bind(this));
        this.router.post('/downloadUrls', this.getDownloadURLs.bind(this));
        this.router.post('/:documentId', this.addImages.bind(this));
        this.router.delete('/:documentId', this.deleteImage.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/images', this.router);
    }

    async getUploadURLS(req: Request, res: Response, next: NextFunction) {
        const { imageNames } = req.body as { imageNames: string[] };
        try {
            const result = await services.imageService.getUploadURLS(imageNames);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async getDownloadURLs(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).userId;
        const { imageNamesWithGuid, documentId } = req.body as { imageNamesWithGuid: string[], documentId: string };
        try {
            const result = await services.imageService.getDownloadURLs(userId, imageNamesWithGuid, documentId);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async addImages(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).userId;
        const { documentId } = req.params;
        const { newImageNamesWithGuid } = req.body;
        try {
            const docId = await services.imageService.addImages(userId, documentId, newImageNamesWithGuid);
            res.status(201).json(docId);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async deleteImage(req: Request, res: Response, next: NextFunction) {
        const { documentId } = req.params;
        const userId = (req as CustomRequest).userId;
        const imageNameWithGuidToDelete = req.query.imageNameWithGuidToDelete ? (req.query.imageNameWithGuidToDelete as string) : null;
        try {
            if (userId && imageNameWithGuidToDelete) {
                await services.imageService.deleteImage(userId, documentId, imageNameWithGuidToDelete);
                res.status(201).json(documentId);
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}
