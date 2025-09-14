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
        userPoolId: 'us-east-2_ec0wURg0C',
        clientId: '78ok0p6onnb6tsa2hgsmrcjjc3'
    },
    server: {
        port: import.meta.env.VITE_APP_SERVER_PORT
    }
};
