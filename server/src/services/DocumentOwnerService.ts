import { Transaction } from 'sequelize';
import { DocumentOwnersRepo } from '../repositories/DocumentOwnersRepo';
import { DocumentData, DocumentOwnerData } from '../types/DocumentTypes';
import { UserData } from '../types/UserTypes';
import { services } from './services';
import { UnauthorizedError } from '../helpers/ErrorHelpers';
export class DocumentOwnerService {
    documentOwnersRepo: DocumentOwnersRepo;
    constructor() {
        this.documentOwnersRepo = new DocumentOwnersRepo();
    }

    async shareDocument(documentId: string, userId: string, partnerEmail: string | null) {
        if (partnerEmail) {
            const partnerUser = (await services.userService.getUserByEmail(partnerEmail)) as UserData;
            const docsOfUser = (await services.documentService.getDocuments(userId)) as DocumentData[];
            const docToBeSharedIsADocOfUser = docsOfUser.map((doc) => doc.documentId).includes(documentId);
            if (docToBeSharedIsADocOfUser) {
                const partnerUserId: string = partnerUser.userId;
                await this.createDocumentOwner(documentId, partnerUserId);
            } else {
                throw new UnauthorizedError()
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
