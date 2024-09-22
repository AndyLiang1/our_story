export type EventMetaData = {
    id: string;
    name: string;
    date: Date;
};

export interface DocumentCreationAttributes  {
    title: string;
    createdByUserId: string;
    date: Date;
};

export interface DocumentData extends DocumentCreationAttributes  {
    documentId: string;
    documentContent: DocumentContent;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

type DocumentContent = {
    type: string;
    content: any;
}