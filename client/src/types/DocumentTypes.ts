export type EventMetaData = {
    id: string;
    name: string;
    date: Date;
};

export interface DocumentCreationAttributes {
    title: string;
    eventDate: Date;
}

export interface DocumentData {
    hasUpdatedInTipTap: boolean;
    documentId: string;
    title: string;
    documentContent: DocumentContent;
    images: string[];
    createdAt: string;
    eventDate: Date;
    firstImageWSignedUrl?: string;
    documentHasUpdatedInTipTap: boolean;
}

type DocumentContent = {
    type: string;
    content: any;
};

export type DocumentsWithFlags = {
    documents: DocumentData[];
    firstDocumentFlag: boolean;
    lastDocumentFlag: boolean;
};
