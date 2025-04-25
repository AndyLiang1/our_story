import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

import { useEffect, useState } from 'react';
import { config } from '../config/config';
import { useUserContext } from '../context/userContext';
import {
    DeleteDocumentConfirmationModalInfo,
    ShareDocumentFormInfo
} from '../types/ModalInfoTypes';
import Editor from './Editor';

export interface ITipTapCollabProps {
    documentIdBefore: string;
    documentId: string;
    documentIdAfter: string;
    documentTitle: string;
    documentHasUpdatedInTipTap: boolean;
    collabFlag?: boolean;
    setShowShareDocumentForm: React.Dispatch<React.SetStateAction<ShareDocumentFormInfo>>;
    setShowDeleteDocumentConfirmationModal: React.Dispatch<
        React.SetStateAction<DeleteDocumentConfirmationModalInfo>
    >;
}

export function TipTapCollab({
    documentIdBefore,
    documentId,
    documentIdAfter,
    documentTitle,
    documentHasUpdatedInTipTap,
    collabFlag = true,
    setShowShareDocumentForm,
    setShowDeleteDocumentConfirmationModal
}: ITipTapCollabProps) {
    const user = useUserContext();
    const { collabToken } = user;
    const [providerAndDoc, setProviderAndDoc] = useState<{
        doc: Y.Doc | null
        provider: TiptapCollabProvider | null
    } | null>(null);

    useEffect(() => {
        const debug = false;
        const doc = collabFlag ? new Y.Doc() : null;
        let provider: TiptapCollabProvider | null = null;
        if (collabFlag && doc) {
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
                    if (debug) console.log('Connected to the server.');
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
                documentIdBefore={documentIdBefore}
                documentId={documentId}
                documentIdAfter={documentIdAfter}
                documentTitle={documentTitle}
                documentHasUpdatedInTipTap={documentHasUpdatedInTipTap}
                setShowShareDocumentForm={setShowShareDocumentForm}
                setShowDeleteDocumentConfirmationModal={setShowDeleteDocumentConfirmationModal}
            />
        )
    );
}
