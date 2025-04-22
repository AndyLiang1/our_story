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
export interface DeleteDocumentConfirmationModalInfo {
    documentIdBefore: string;
    documentId: string;
    documentIdAfter: string;
    status: boolean;
}
