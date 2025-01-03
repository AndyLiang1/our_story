import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

import { config } from '../config/config';
import Editor from './Editor';

export interface ITipTapProps {
    documentId: string;
    documentTitle: string;
    collabToken: string;
    styles: string;
    setRefetchTrigger: React.Dispatch<React.SetStateAction<Object>>;
}

export function TipTap({ documentId, documentTitle, collabToken, styles, setRefetchTrigger }: ITipTapProps) {
    const doc = new Y.Doc();
    const debug = false
    const provider = new TiptapCollabProvider({
        name: documentId, // Unique document identifier for syncing. This is your document name.
        appId: `${config.tiptapProvider.appId}`, // Your Cloud Dashboard AppID or `baseURL` for on-premises
        token: collabToken,
        document: doc,
        // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content loading on editor syncs.
        onOpen() {
            if(debug) console.log('WebSocket connection opened');
        },
        onConnect() {
            if(true) console.log('Connected to the server.');
        },
        onAuthenticated() {
            if(debug) console.log('Authenticated');
        },
        onAuthenticationFailed() {
            if(debug) console.log('Auth failed.');
        },        
    });

    return <Editor provider={provider} ydoc={doc} styles ={styles} collabToken={collabToken} documentId={documentId} documentTitle={documentTitle} setRefetchTrigger={setRefetchTrigger} />;
}
