export interface DocumentData {
    documentId: string;
    title: string;
    eventDate: Date; // YYYY-MM-DD
    images: string[];
    createdAt: Date; // needed in get neighbouring docs
    hasUpdatedInTipTap: boolean;
    ydoc?: Buffer;
    documentContent?: DocumentContent
    // updatedAt: Date;
    firstImageWSignedUrl?: string | null; // only needed by all story page, and is set in the service layer as it requires the image service as well
}

export type DocumentDataKeys = keyof DocumentData;

export interface DocumentCreationAttributes {
    title: string;
    createdByUserId: string;
    documentContent: DocumentContent;
    eventDate: Date; // YYYY-MM-DD
    images: string[];
}

interface DocumentUpdateAttributes {
    title: string;
    documentContent: DocumentContent;
    ydoc?: Buffer;
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

export type DocumentsWithCount = {
    documents: DocumentData[];
    total: number;
    page: number;
    totalPages: number;
};
