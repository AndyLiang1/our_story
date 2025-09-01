import { Hocuspocus } from '@hocuspocus/server';
import * as Y from 'yjs';
import { JwtVerifier } from './middleware/JwtVerifier';
import { services } from './services/services';

export const initHocuspocusWebsocketServer = async () => {
    const hocuspocus = new Hocuspocus({
        async onAuthenticate({ token, context }) {
            try {
                const decoded = await JwtVerifier.verifyCollabTokenHelper(token);
                console.log('Verified JWT for socket connection.');
                context.userId = decoded.userId;
                return true;
            } catch (err) {
                throw new Error('Not authorized!');
            }
        },
        async onLoadDocument({ documentName, context }) {
            const ydoc = new Y.Doc();
            const forCollab = true;
            const documentData = await services.documentService.getDocument(context.userId, documentName, forCollab);
            if (documentData && documentData.ydoc) {
                const update = new Uint8Array(documentData.ydoc as Buffer);
                Y.applyUpdate(ydoc, update);
            }
            return ydoc;
        },
        async onStoreDocument({ documentName, document, context }) {
            try {
                const state = Y.encodeStateAsUpdate(document);
                const documentData = { ydoc: Buffer.from(state) as Uint8Array, hasUpdatedInTipTap: true };
                await services.documentService.updateDocument(context.userId, documentName, documentData);
                console.log(`Document ${documentName} stored successfully.`);
            } catch (err) {
                console.error('Error storing document:', err);
            }
        }
    });
    return hocuspocus;
};
