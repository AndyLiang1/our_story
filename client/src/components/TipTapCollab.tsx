import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

import { useEffect, useState } from 'react';
import { config } from '../config/config';
import Editor from './Editor';

export interface ITipTapCollabProps {
    documentId: string;
    documentTitle: string;
    collabToken: string;
    styles: string;
    setRefetchTrigger: React.Dispatch<React.SetStateAction<Object>>;
    collabFlag?: boolean;
    index?: number;
    desiredLoc?: number;
}

export function TipTapCollab({
    documentId,
    documentTitle,
    collabToken,
    styles,
    setRefetchTrigger,
    collabFlag = true,
    index,
    desiredLoc
}: ITipTapCollabProps) {
    const [providerAndDoc, setProviderAndDoc] = useState<any>(null);
    // const provider = new TiptapCollabProvider({
    //     name: documentId, // Unique document identifier for syncing. This is your document name.
    //     appId: `${config.tiptapProvider.appId}`, // Your Cloud Dashboard AppID or `baseURL` for on-premises
    //     token: collabToken,
    //     document: doc,
    //     // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content loading on editor syncs.
    //     onOpen() {
    //         if (debug) console.log('WebSocket connection opened');
    //     },
    //     onConnect() {
    //         if (true) console.log('Connected to the server.');
    //     },
    //     onAuthenticated() {
    //         if (debug) console.log('Authenticated');
    //     },
    //     onAuthenticationFailed() {
    //         if (debug) console.log('Auth failed.');
    //     }
    // });
    useEffect(() => {
        const debug = false;
        const doc: any = (collabFlag) ? new Y.Doc() : null;
        let provider: any = null;
        if (collabFlag) {
            provider = new TiptapCollabProvider({
                name: documentId, // Unique document identifier for syncing. This is your document name.
                appId: `${config.tiptapProvider.appId}`, // Your Cloud Dashboard AppID or `baseURL` for on-premises
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
                styles={styles}
                collabToken={collabToken}
                documentId={documentId}
                documentTitle={documentTitle}
                setRefetchTrigger={setRefetchTrigger}
            />
        )
    );
}
