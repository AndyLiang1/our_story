import {UserCreationData} from "../types/UserTypes"

export interface DocumentData extends DocumentCreationAttributes {
    documentId: string;
    createdAt: Date;
    updatedAt: Date;
    users: UserCreationData[]
}

export type DocumentDataKeys = keyof DocumentData;

export interface DocumentCreationAttributes {
    title: string;
    documentContent: DocumentContent;
    createdByUserId: string;
    eventDate: Date; // YYYY-MM-DD
    images: string[]
}

interface DocumentUpdateAttributes {
    title: string;
    documentContent: DocumentContent;
    hasUpdatedInTipTap: boolean;
    images: string[];
}
export type PartialDocumentUpdateAttributes = Partial<DocumentUpdateAttributes>;

type DocumentContent = {
    type: string;
    content: any;
};

export type DocumentOwnerData = {
    documentId: string;
    userId: string;
};

interface DocumentQueryParams {
    userId: string;
    hasUpdatedInTipTap: boolean;
}

export type PartialDocumentQueryParams = Partial<DocumentQueryParams>;

export type DocumentsWithFlags = {
    documents: DocumentData[];
    firstDocumentFlag: boolean;
    lastDocumentFlag: boolean;
};