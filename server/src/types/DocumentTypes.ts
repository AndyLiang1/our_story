// Schema of document from a get 
export interface DocumentData extends DocumentCreationAttributes  {
    documentId: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

export interface DocumentCreationAttributes  {
    title: string;
    documentContent: DocumentContent;
    createdByUserId: string;
};



type DocumentContent = {
    type: string;
    content: any; // Depending on the structure of the content, you can type it more strictly
}

export type DocumentOwnerData = {
    documentId: string;
    userId: string;
};

interface DocumentQueryParams {
    userId: string; 
    hasUpdated: boolean;
}

export type PartialDocumentQueryParams = Partial<DocumentQueryParams>