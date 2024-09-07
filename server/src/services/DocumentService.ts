import { Document } from '../models/Document';
import { DocumentOwnersRepo } from '../repositories/DocumentOwnersRepo';
import { DocumentRepo } from '../repositories/DocumentRepo';
import { DocumentData, DocumentOwnerData } from '../types/DocumentTypes';

export class DocumentService {
    documentRepo: DocumentRepo;
    documentOwnerRepo: DocumentOwnersRepo;

    constructor() {
        this.documentRepo = new DocumentRepo();
        this.documentOwnerRepo = new DocumentOwnersRepo();
    }

    async getDocumentsOwnedByUser(userId: string) {
        const docs = await this.documentRepo.getDocumentsOwnedByUser(userId);
        return docs;
    }

    async getDocument(documentId: string) {
        const data = await this.documentRepo.getDocument(documentId);
        return data;
    }

    async createDocument(documentData: DocumentData) {
        const doc: Document = await this.documentRepo.createDocument(documentData);
        const docId = doc.getDataValue('documentId');

        const owner = await this.documentOwnerRepo.creatDocumentOwner({
            documentId: docId,
            userId: documentData.createdByUserId
        });
        return doc;
    }

    async updateDocument(documentId: string, documentData: DocumentData) {
        try {
            const data = await this.documentRepo.updateDocument(documentId, documentData);
            return data;
        } catch (error) {
            console.error(`Failed to update: ${error}`);
        }
    }

    async deleteDocument(documentId: string) {
        await this.documentRepo.deleteDocument(documentId);
    }

    async addOwners(documentId: string, owners: string[]) {
        var result = [];
        for (var userId of owners) {
            const data = await this.documentOwnerRepo.creatDocumentOwner({
                documentId,
                userId
            });
            result.push(data);
        }
        return result;
    }

    async deleteOwner(data: DocumentOwnerData) {
        await this.documentOwnerRepo.deleteDocumentOwner(data);
    }
}
