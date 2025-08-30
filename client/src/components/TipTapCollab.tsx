import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

import { useEffect, useState } from 'react';
import { useUserContext } from '../context/userContext';
import {
    DeleteDocumentConfirmationModalInfo,
    ShareDocumentFormInfo
} from '../types/ModalInfoTypes';
import Editor from './Editor';
import { config } from '../config/config';

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
        doc: Y.Doc | null;
        provider: HocuspocusProvider | null;
    } | null>(null);

    useEffect(() => {
        const doc = collabFlag ? new Y.Doc() : null;
        let provider: HocuspocusProvider | null = null;
        if (collabFlag && doc) {
            provider = new HocuspocusProvider({
                url: config.hocuspocusUrl,
                name: documentId,
                document: doc,
                token: collabToken
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
