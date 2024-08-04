import * as Y from 'yjs';
import { TiptapCollabProvider } from '@hocuspocus/provider';

import { FaBold } from 'react-icons/fa';

import { config } from '../config/config';
import Editor from './Editor';

import { useEffect, useState } from 'react';

export interface ITipTapProps {
    jwt: string
}

export function TipTap({jwt}: ITipTapProps) {
    const doc = new Y.Doc();
    const provider = new TiptapCollabProvider({
        name: 'test_doc', // Unique document identifier for syncing. This is your document name.
        appId: `${config.tiptapProvider.appId}`, // Your Cloud Dashboard AppID or `baseURL` for on-premises
        token: jwt,
        document: doc,
        // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content loading on editor syncs.
        onOpen() {
            console.log('WebSocket connection opened');
        },
        onConnect() {
            console.log('Connected to the server.');
        },
        onAuthenticated() {
            console.log('Authenticated');
        },
        onAuthenticationFailed() {
            console.log('Auth failed.');
        }
    });

    return (
        <>
            <Editor provider={provider} ydoc={doc} />
        </>
    );
}
