import { Hocuspocus } from '@hocuspocus/server';
import { JwtVerifier } from './middleware/JwtVerifier';

export const initHocuspocusWebsocketServer = async () => {
    const hocuspocusServer = new Hocuspocus({
        async onAuthenticate(data) {
            try {
                const decoded = await JwtVerifier.verifyCollabTokenHelper(data.token);
                console.log('Verified JWT for socket connection.');
                return decoded.userId;
            } catch (err) {
                throw new Error('Not authorized!');
            }
        }
    });
    return hocuspocusServer;
};
