import { Hocuspocus } from '@hocuspocus/server';
import * as Y from 'yjs';
import { JwtVerifier } from './middleware/JwtVerifier';
import { Document } from './models/Document'; // your Sequelize model

export const initHocuspocusWebsocketServer = async () => {
    const hocuspocusServer = new Hocuspocus({
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
        async onLoadDocument({ documentName }) {
            const ydoc = new Y.Doc();
            const dbDoc = await Document.findOne({ where: { documentId: documentName } });
            
            if (dbDoc && dbDoc.getDataValue('ydoc')) {
                const update = new Uint8Array(dbDoc.getDataValue('ydoc') as Buffer); 
                Y.applyUpdate(ydoc, update);
            }
            
            return ydoc;
        },
        async onStoreDocument({ documentName, document, context }) {
            try {
                const state = Y.encodeStateAsUpdate(document);
                const [doc, created] = await Document.findOrCreate({
                    where: { documentId: documentName },
                    defaults: {
                        documentId: documentName,
                        ydoc: Buffer.from(state)
                    }
                });

                if (!created) {
                    await doc.update({ ydoc: Buffer.from(state) });
                }

                console.log(`Document ${documentName} stored successfully.`);
            } catch (err) {
                console.error('Error storing document:', err);
            }
        }
    });
    return hocuspocusServer;
};
