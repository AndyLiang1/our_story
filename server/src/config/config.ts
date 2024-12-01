import dotenv from 'dotenv';

dotenv.config();

const POSTGRES_URL: string = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const SERVER_PORT: number = Number(process.env.PORT) ? Number(process.env.PORT) : 3001;
const ENV: string = process.env.ENV || 'DEV';
const JWT_SECRET = process.env.JWT_SECRET || '';

export const config = {
    postgres: {
        dbSchema: 'our_story',
        url: POSTGRES_URL
    },
    server: {
        port: SERVER_PORT,
        env: ENV, // unused atm
        JWT_SECRET // unused atm
    },
    tiptap: {
        restApiUrl: `https://${process.env.TIPTAP_APP_ID}.collab.tiptap.cloud/api/documents`,
        apiSecret: process.env.TIPTAP_API_SECRET,
        appSecret: process.env.TIPTAP_APP_SECRET
    },
    awsUser: {
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        cognitoUserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        cognitoClientId: process.env.AWS_COGNITO_CLIENT_ID,
        region: 'us-east-2',
        s3BucketName: process.env.S3_BUCKET_NAME
    }
};
