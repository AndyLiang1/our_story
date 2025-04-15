import { PartnerRepo } from '../repositories/PartnerRepo';
import { DocumentData, DocumentOwnerData } from '../types/DocumentTypes';
import { services } from './services';

export class PartnerService {
    partnerRepo: PartnerRepo;
    constructor() {
        this.partnerRepo = new PartnerRepo();
    }

    async createPartner(userId1: string, partnerEmail: string) {
        const partnerUser = await services.userService.getUserByEmail(partnerEmail);

        if (partnerUser) {
            if(partnerUser.getDataValue('email') !== partnerEmail) throw Error('You can only have one partner')

            const partnerUserId = partnerUser.getDataValue('userId');
            const partnerUserAlsoHasYouAsParnter = await this.partnerUserHasYouAsPartner(userId1, partnerUserId);
            if (partnerUserAlsoHasYouAsParnter) {
                await this.shareAllPreviousDocument(userId1, partnerUserId);
            }
            await this.partnerRepo.createPartner(userId1, partnerUserId);
        } else {
            throw Error('No user exists with that email');
        }
    }

    async partnerUserHasYouAsPartner(userId1: string, partnerUserId: string) {
        const userIdOfPartnersPartner = await this.partnerRepo.getPartnerId(partnerUserId);
        return userIdOfPartnersPartner === userId1
    }

    async shareAllPreviousDocument(userId1: string, partnerUserId: string) {
        const documentsFromUser1 = await services.documentService.getDocuments(userId1) as DocumentData[]
        const documentsFromUser2 = await services.documentService.getDocuments(partnerUserId) as DocumentData[]

        const docIdSetOfUser1 = new Set(documentsFromUser1.map((doc) => doc.documentId))
        const docIdSetOfUser2 = new Set(documentsFromUser2.map((doc) => doc.documentId))

        const documentOwnershipsToCreate: DocumentOwnerData[] = []
        docIdSetOfUser1.forEach((docId) => {
            if (!docIdSetOfUser2.has(docId)) { 
                documentOwnershipsToCreate.push({ documentId: docId, userId: partnerUserId });
            }
        })

        docIdSetOfUser2.forEach((docId) => {
            if (!docIdSetOfUser1.has(docId)) { 
                documentOwnershipsToCreate.push({ documentId: docId, userId: userId1 });
            }
        })

        await services.documentOwnerService.bulkCreateDocumentOwner(documentOwnershipsToCreate)        
    }

    async getPartnerId(userIdWhosePartnersWeWant: string) {
        return await this.partnerRepo.getPartnerId(userIdWhosePartnersWeWant);
    }

    async deletePartners(userId1: string, partnerEmail: string) {
        const partnerUserId = await services.userService.getUserByEmail(partnerEmail);
        if (partnerUserId) {
            await this.partnerRepo.deletePartner(userId1, partnerUserId.getDataValue('userId'));
        } else {
            throw Error('No user exists with that email');
        }
    }
}
