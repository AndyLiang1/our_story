import express, { NextFunction, Request, Response, Router } from 'express';
import { config } from '../config/config';
import { s3 } from '../s3';

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

        const params = {
            Bucket: config.awsS3.bucketName,
            Key: imageName,
            Expires: 60
        };

        const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
        console.log("Url: ")
        console.log(uploadUrl);
        res.status(200).json(uploadUrl);
    }
}
