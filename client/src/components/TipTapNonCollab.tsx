import * as React from 'react';
import Editor from './Editor';

export interface ITipTapNonCollabProps {
    documentId: string;
    documentTitle: string;
    collabToken: string;
    styles: string;
    setRefetchTrigger: React.Dispatch<React.SetStateAction<Object>>;
}

export function TipTapNonCollab({
    documentId,
    documentTitle,
    collabToken,
    styles,
    setRefetchTrigger
}: ITipTapNonCollabProps) {
    return (
        <div className = 'h-full w-full'>
            <Editor
                styles={'h-full w-full'}
                collabToken={collabToken}
                documentId={documentId}
                documentTitle={documentTitle}
                setRefetchTrigger={setRefetchTrigger}
                collabFlag = {false}
            />
        </div>
    );
}
