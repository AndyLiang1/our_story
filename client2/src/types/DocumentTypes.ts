export type EventMetaData = {
    id: string;
    name: string;
    date: Date;
};

export interface DocumentCreationAttributes {
    title: string;
    eventDate: Date;
}

export interface DocumentData extends DocumentCreationAttributes {
    documentId: string;
    title: string;
    documentContent: DocumentContent;
    images: string[];
    createdAt: string;
    updatedAt: string;
    eventDate: Date;
    firstImageWSignedUrl?: string;
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

export interface UploadImageModalInfo {
    documentId: string;
    status: boolean;
    refetch: boolean;
}

export interface ShareDocumentFormInfo {
    documentId: string;
    documentTitle: string;
    status: boolean;
}
