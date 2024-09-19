import express, { NextFunction, Request, Response, Router } from 'express';
import { config } from '../config/config';
import { s3Client } from '../s3';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export class ImageController {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.router.get('/', this.generateUploadURL.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/images', this.router);
    }

    async generateUploadURL(req: Request, res: Response, next: NextFunction) {
        const imageName = 'img-name';

        const params: PutObjectCommandInput = {
            Bucket: config.awsS3.bucketName,
            Key: imageName,
        };

        const command = new PutObjectCommand(params);
        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log("Url: ")
        console.log(uploadUrl);
        res.status(200).json(uploadUrl);
    }
}
