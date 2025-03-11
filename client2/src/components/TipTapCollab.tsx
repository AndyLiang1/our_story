import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

import { useEffect, useState } from 'react';
import { config } from '../config/config';
import { useUserContext } from '../context/userContext';
import { ShareDocumentFormInfo } from '../types/DocumentTypes';
import Editor from './Editor';

export interface ITipTapCollabProps {
    documentId: string;
    documentTitle: string;
    collabFlag?: boolean;
    setShowShareDocumentForm: React.Dispatch<React.SetStateAction<ShareDocumentFormInfo>>;
}

export function TipTapCollab({
    documentId,
    documentTitle,
    collabFlag = true,
    setShowShareDocumentForm
}: ITipTapCollabProps) {
    const user = useUserContext();
    const { collabToken } = user;
    const [providerAndDoc, setProviderAndDoc] = useState<any>(null);

    useEffect(() => {
        const debug = false;
        const doc: any = collabFlag ? new Y.Doc() : null;
        let provider: any = null;
        if (collabFlag) {
            provider = new TiptapCollabProvider({
                name: documentId,
                appId: `${config.tiptapProvider.appId}`,
                token: collabToken,
                document: doc,
                // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content loading on editor syncs.
                onOpen() {
                    if (debug) console.log('WebSocket connection opened');
                },
                onConnect() {
                    if (true) console.log('Connected to the server.');
                },
                onAuthenticated() {
                    if (debug) console.log('Authenticated');
                },
                onAuthenticationFailed() {
                    if (debug) console.log('Auth failed.');
                }
            });
        }

        setProviderAndDoc({
            doc,
            provider
        });

        return () => {
            if (provider) provider.destroy();
        };
    }, [collabFlag]);

    return (
        providerAndDoc && (
            <Editor
                provider={providerAndDoc.provider}
                ydoc={providerAndDoc.doc}
                documentId={documentId}
                documentTitle={documentTitle}
                setShowShareDocumentForm={setShowShareDocumentForm}
            />
        )
    );
}
