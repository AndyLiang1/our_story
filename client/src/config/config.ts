export const config = {
    baseUrl:
        import.meta.env.VITE_APP_NODE_ENV == 'production'
            ? 'https://ourstory-api.fly.dev'
            : 'http://localhost:3002',
    hocuspocusUrl: 
        import.meta.env.VITE_APP_NODE_ENV == 'production'
            ? 'https://ourstory-api.fly.dev/collaboration'
            : 'ws://localhost:3002/collaboration',
    tiptapProvider: {
        appId: import.meta.env.VITE_APP_APP_ID
    },
    cognito: {
        region: 'us-east-2',
        userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
        clientId: import.meta.env.VITE_APP_CLIENT_ID
    },
    server: {
        port: import.meta.env.VITE_APP_SERVER_PORT
    }
};
