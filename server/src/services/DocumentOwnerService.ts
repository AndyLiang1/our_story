import { Transaction } from 'sequelize';
import { DocumentOwnersRepo } from '../repositories/DocumentOwnersRepo';
import { DocumentData, DocumentOwnerData } from '../types/DocumentTypes';
import { services } from './services';
export class DocumentOwnerService {
    documentOwnersRepo: DocumentOwnersRepo;
    constructor() {
        this.documentOwnersRepo = new DocumentOwnersRepo();
    }

    async shareDocument(documentId: string, userId: string, partnerEmail: string | null) {
        if (partnerEmail) {
            const partnerUser = await services.userService.getUserByEmail(partnerEmail);
            const docsOfUser = (await services.documentService.getDocuments(userId)) as DocumentData[];
            const docToBeSharedIsADocOfUser = docsOfUser.map((doc) => doc.documentId).includes(documentId);
            if (partnerUser && docToBeSharedIsADocOfUser) {
                const partnerUserId: string = partnerUser.userId;
                await this.createDocumentOwner(documentId, partnerUserId);
            } else {
                throw Error('Partner not found');
            }
        }
    }

    async createDocumentOwner(documentId: string, partnerUserId: string, transaction?: Transaction) {
        await this.documentOwnersRepo.createDocumentOwner({ documentId, userId: partnerUserId }, transaction);
    }

    async bulkCreateDocumentOwner(documentOwnerDatas: DocumentOwnerData[]) {
        await this.documentOwnersRepo.bulkCreateDocumentOwner(documentOwnerDatas);
    }
}
