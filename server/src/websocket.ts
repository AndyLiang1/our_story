import { Hocuspocus } from '@hocuspocus/server';
import { JwtVerifier } from './middleware/JwtVerifier';
import { Document } from './models/Document'; // your Sequelize model
import * as Y from 'yjs';

export const initHocuspocusWebsocketServer = async () => {
    const hocuspocusServer = new Hocuspocus({
        async onAuthenticate({token, context}) {
            try {
                const decoded = await JwtVerifier.verifyCollabTokenHelper(token);
                console.log('Verified JWT for socket connection.');
                context.userId = decoded.userId;
                return true
            } catch (err) {
                throw new Error('Not authorized!');
            }
        },
        async onStoreDocument({documentName, document, context}) {
             try {
                const state = Y.encodeStateAsUpdate(document);
                const [doc, created] = await Document.findOrCreate({
                    where: { documentId: documentName },
                    defaults: {
                        documentId: documentName,
                        ydoc: state,
                    }
                });

                if (!created) {
                    await doc.update({ ydoc: state });
                }

                console.log(`Document ${documentName} stored successfully.`);
            } catch (err) {
                console.error('Error storing document:', err);
            }
        }
    });
    return hocuspocusServer;
};
