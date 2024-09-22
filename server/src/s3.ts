import { S3Client } from '@aws-sdk/client-s3';
import { config } from './config/config';

export const s3Client = new S3Client({
    region: config.awsS3.region as string,
    credentials: {
        accessKeyId: config.awsS3.accessKey as string,
        secretAccessKey: config.awsS3.secretAccessKey as string
    }
});
