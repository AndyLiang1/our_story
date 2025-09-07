import { Hocuspocus } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { AnyExtension } from '@tiptap/core';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from "@tiptap/starter-kit"
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
            // const ydoc = new Y.Doc();
            // const forCollab = true;
            // const documentData = await services.documentService.getDocument(context.userId, documentName, forCollab);
            // const extensions: any = [Highlight, StarterKit];
            // const ydocFromDocumentFromDb = TiptapTransformer.toYdoc(
            //     {
            //         type: 'doc',
            //         content: documentData.documentContent
            //     },
            //     'default',
            //     extensions
            // );
            // const ydocBinaryData = Y.encodeStateAsUpdate(ydocFromDocumentFromDb);
            // const update = new Uint8Array(ydocBinaryData as Buffer);
            // Y.applyUpdate(ydoc, update);
            // return ydoc;
        },
        async onStoreDocument({ documentName, document, context }) {
            try {
                const state = Y.encodeStateAsUpdate(document);
                const documentData = { ydoc: Buffer.from(state), hasUpdatedInTipTap: true };
                await services.documentService.updateDocument(context.userId, documentName, documentData);
                console.log(`Document ${documentName} stored successfully.`);
            } catch (err) {
                console.error('Error storing document:', err);
            }
        }
    });
    return hocuspocus;
};
