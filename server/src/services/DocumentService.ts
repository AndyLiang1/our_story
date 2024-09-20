import { Document } from '../models/Document';
import { DocumentOwnersRepo } from '../repositories/DocumentOwnersRepo';
import { DocumentRepo } from '../repositories/DocumentRepo';
import { DocumentCreationAttributes, DocumentData, DocumentOwnerData } from '../types/DocumentTypes';
import {services} from "./services"
export class DocumentService {
    documentRepo: DocumentRepo;
    documentOwnerRepo: DocumentOwnersRepo;

    constructor() {
        this.documentRepo = new DocumentRepo();
        this.documentOwnerRepo = new DocumentOwnersRepo();
    }

    async getDocumentsOwnedByUser(userId: string, startDate: string = '', endDate: string = '') {
        const docs = await this.documentRepo.getDocumentsOwnedByUser(userId, startDate, endDate);
        return docs;
    }

    async getDocument(documentId: string) {
        const docFromDB: DocumentData | null = await this.documentRepo.getDocument(documentId);
        const docFromTipTap = await services.tiptapDocumentService.getDocument(documentId)
        let data = {}
        if(docFromDB) {
            data = {
                documentId: docFromDB.documentId,
                title: docFromDB.title, 
                documentContent: docFromTipTap,
                createdAt: docFromDB.createdAt, 
                updatedAt: docFromDB.updatedAt, 
                images: docFromDB.images, 
                createdByUserId: docFromDB.createdByUserId
            }
        }
       
        return data;
    }

    async createDocument(documentData: DocumentCreationAttributes) {
        const doc: Document = await this.documentRepo.createDocument(documentData);
        const docId = doc.getDataValue('documentId');

        const owner = await this.documentOwnerRepo.creatDocumentOwner({
            documentId: docId,
            userId: documentData.createdByUserId
        });

        await services.tiptapDocumentService.createDocument(docId, documentData)
        return doc;
    }

    async updateDocument(documentId: string, documentData: DocumentCreationAttributes) {
        try {
            const data = await this.documentRepo.updateDocument(documentId, documentData);
            return data;
        } catch (error) {
            console.error(`Failed to update: ${error}`);
        }
    }

    async deleteDocument(documentId: string) {
        await this.documentRepo.deleteDocument(documentId);
        await services.tiptapDocumentService.deleteDocument(documentId);
    }

    async syncDocuments() {

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
