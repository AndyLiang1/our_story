export const config = {
    baseUrl: process.env.NODE_ENV == "production" ? "https://ourstory-api.fly.dev/" : "http://localhost:3002/",
    tiptapProvider: {
        appId: process.env.REACT_APP_APP_ID,
    }
};