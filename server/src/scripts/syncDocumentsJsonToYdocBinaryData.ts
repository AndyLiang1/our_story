import { services } from '../services/services';
export async function syncDocumentJsonToYdocBinaryData() {
    const documentIds: string[] = []; // fill this in
    for (const documentId of documentIds) {
        await services.documentService.syncDocumentJsonToYdocBinaryData(documentId);
    }
}
