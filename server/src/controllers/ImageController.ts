import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import express, { NextFunction, Request, Response, Router } from 'express';
import { config } from '../config/config';
import { s3Client } from '../s3';
import { v4 as uuidv4 } from 'uuid';

export class ImageController {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.router.get('/:imageName', this.generateUploadURL.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/images', this.router);
    }

    async generateUploadURL(req: Request, res: Response, next: NextFunction) {
        let {imageName} = req.params;
        imageName = imageName+ "-" + uuidv4();

        const params: PutObjectCommandInput = {
            Bucket: config.awsUser.s3BucketName,
            Key: imageName
        };

        const command = new PutObjectCommand(params);
        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        res.status(200).json(uploadUrl);
    }
}

