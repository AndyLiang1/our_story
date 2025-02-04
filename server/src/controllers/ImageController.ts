import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import express, { NextFunction, Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config';
import { JwtVerifier } from '../middleware/JwtVerifier';
import { s3Client } from '../s3';
import { services } from '../services/services';

export class ImageController {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.router.use(JwtVerifier.verifyCollabToken);
        this.router.post('/uploadUrls', this.generateUploadURLs.bind(this));
        this.router.post('/downloadUrls', this.generateDownloadURLs.bind(this));
        this.router.post('/:documentId', this.addImages.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/images', this.router);
    }

    async generateUploadURLs(req: Request, res: Response, next: NextFunction) {
        const { imageNames } = req.body as { imageNames: string[] }; // Assuming imageNames are passed as an array in the request body
        const uniqueImageNames: string[] = [];

        try {
            const signedUrls = await Promise.all(
                imageNames.map(async (imageName) => {
                    const extension = imageName.substring(imageName.lastIndexOf('.'));
                    const baseName = imageName.substring(0, imageName.lastIndexOf('.'));
                    const uniqueImageName = `${baseName}-${uuidv4()}${extension}`;
                    uniqueImageNames.push(uniqueImageName);
                    const params: PutObjectCommandInput = {
                        Bucket: config.awsUser.s3BucketName,
                        Key: uniqueImageName,
                        ContentType: `image/*`
                    };

                    const command = new PutObjectCommand(params);
                    return getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 7 });
                })
            );
            res.status(200).json({
                uniqueImageNames,
                signedUploadUrls: signedUrls
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async generateDownloadURLs(req: Request, res: Response, next: NextFunction) {
        const { imageNames } = req.body as { imageNames: string[] };
        try {
            const signedUrls = await Promise.all(
                imageNames.map(async (imageName) => {
                    const params = {
                        Bucket: config.awsUser.s3BucketName,
                        Key: imageName
                    };

                    const command = new GetObjectCommand(params);
                    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
                })
            );
            res.status(200).json({
                uniqueImageNames: imageNames,
                signedDownloadUrls: signedUrls
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async addImages(req: Request, res: Response, next: NextFunction) {
        const { documentId } = req.params;
        const { userId, newImageNamesWithGuid } = req.body;
        try {
            await services.documentService.addImages(userId, documentId, newImageNamesWithGuid);
            res.status(201).json(documentId);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}
