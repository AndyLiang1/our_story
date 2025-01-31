export type EventMetaData = {
    id: string;
    name: string;
    date: Date;
};

export interface DocumentCreationAttributes  {
    title: string;
    createdByUserId: string;
    eventDate: Date;
};

export interface DocumentData extends DocumentCreationAttributes  {
    documentId: string;
    title: string;
    documentContent: DocumentContent;
    images: string[];
    createdAt: string;
    updatedAt: string;
    eventDate: Date;
}

type DocumentContent = {
    type: string;
    content: any;
}

export type DocumentsWithFlags = {
    documents: DocumentData[];
    firstDocumentFlag: boolean;
    lastDocumentFlag: boolean;
};


export type UploadImageModalInfo = {
    documentId: string, 
    status: boolean,
    currentImageNamesWGuidForDocument: string[]
}