import dotenv from 'dotenv'

dotenv.config()

const POSTGRES_URL: string = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const SERVER_PORT: number = Number(process.env.PORT) ? Number(process.env.PORT) : 3001
const ENV: string = process.env.ENV || 'DEV'
const JWT_SECRET = process.env.JWT_SECRET || ''

export const config = {
    postgres: {
        dbSchema: "our_story",
        url: POSTGRES_URL
    },
    server: {
        port: SERVER_PORT,
        env: ENV, // unused atm 
        JWT_SECRET, // unused atm
    },
    tiptapProvider: {
        appSecret: process.env.TIPTAP_APP_SECRET
    },
    awsCognito: {
        userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        clientId: process.env.AWS_COGNITO_CLIENT_ID
    }
};