import dotenv from 'dotenv';

dotenv.config();

const POSTGRES_URL_PROD: string = `postgres://${process.env.DB_USER_PROD}:${process.env.DB_PASS_PROD}@${process.env.DB_HOST_PROD}:${process.env.DB_PORT_PROD}/${process.env.DB_NAME_PROD}`;
const POSTGRES_URL_DEV: string = `postgres://${process.env.DB_USER_DEV}:${process.env.DB_PASS_DEV}@${process.env.DB_HOST_DEV}:${process.env.DB_PORT_DEV}/${process.env.DB_NAME_DEV}`;
const WEB_SERVER_PORT: number = Number(process.env.WEB_SERVER_PORT) ? Number(process.env.WEB_SERVER_PORT) : 3001;
const HOCUSPOCUS_SERVER_PORT: number = Number(process.env.HOCUSPOCUS_SERVER_PORT) ? Number(process.env.HOCUSPOCUS_SERVER_PORT) : 1235;
const ENV: string = process.env.ENV || 'DEV';
const JWT_SECRET = process.env.JWT_SECRET || '';

export const config = {
    postgres: {
        dbSchema: 'our_story',
        url: ENV === 'DEV' ? POSTGRES_URL_DEV : POSTGRES_URL_PROD
    },
    webServer: {
        port: WEB_SERVER_PORT,
        env: ENV, // unused atm
        JWT_SECRET // unused atm
    },
    hocuspocusServer: {
        port: HOCUSPOCUS_SERVER_PORT
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
