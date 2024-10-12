import { S3Client } from '@aws-sdk/client-s3';
import { config } from './config/config';

export const s3Client = new S3Client({
    region: config.awsUser.region as string,
    credentials: {
        accessKeyId: config.awsUser.accessKey as string,
        secretAccessKey: config.awsUser.secretAccessKey as string
    }
});
