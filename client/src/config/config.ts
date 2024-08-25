export const config = {
    baseUrl:
        process.env.REACT_APP_NODE_ENV == 'production'
            ? 'https://ourstory-api.fly.dev/'
            : 'http://localhost:3002/',
    tiptapProvider: {
        appId: process.env.REACT_APP_APP_ID
    },
    cognito: {
        region: 'us-east-2',
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        clientId: process.env.REACT_APP_CLIENT_ID
    }
};
