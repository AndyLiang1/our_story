// Schema of document from a get
export interface DocumentData extends DocumentCreationAttributes {
    documentId: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

export interface DocumentCreationAttributes {
    title: string;
    documentContent: DocumentContent;
    createdByUserId: string;
    eventDate: string; // YYYY-MM-DD
}

interface DocumentUpdateAttributes {
    title: string;
    documentContent: DocumentContent;
    hasUpdatedInTipTap: boolean;
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
