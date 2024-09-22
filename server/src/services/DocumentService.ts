import sequelize from '../db';
import { Document } from '../models/Document';
import { DocumentOwnersRepo } from '../repositories/DocumentOwnersRepo';
import { DocumentRepo } from '../repositories/DocumentRepo';
import { DocumentCreationAttributes, DocumentData, DocumentOwnerData, PartialDocumentUpdateAttributes } from '../types/DocumentTypes';
import {services} from "./services"
export class DocumentService {
    documentRepo: DocumentRepo;
    documentOwnerRepo: DocumentOwnersRepo;

    constructor() {
        this.documentRepo = new DocumentRepo();
        this.documentOwnerRepo = new DocumentOwnersRepo();
    }

    async getDocuments(userId: string | null = null, startDate: string | null= null, endDate: string | null= null, hasUpdated: boolean | null = null) {
        const docs = await this.documentRepo.getDocuments(userId, startDate, endDate, hasUpdated);
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
        return await sequelize.transaction(async t => {
            const newDocId: string = await this.documentRepo
                .createDocument(documentData, t);

            const owner = await this.documentOwnerRepo
                .creatDocumentOwner(
                    {
                        documentId: newDocId,
                        userId: documentData.createdByUserId
                    },
                    t
                );
    
            await services.tiptapDocumentService.createDocument(newDocId, documentData)
            return newDocId;
        })
        
    }

    async updateDocument(documentId: string, documentData: PartialDocumentUpdateAttributes) {
        const data = await this.documentRepo.updateDocument(documentId, documentData);
        return data;
        
    }

    async deleteDocument(documentId: string) {
        await sequelize.transaction(async t => {
            await this.documentRepo.deleteDocument(documentId, t);
            await services.tiptapDocumentService.deleteDocument(documentId);
        })
    }

    async syncDocuments() {
        const docsThatNeedUpdating = await this.documentRepo.getDocuments(null, null, null, true)

        for(const docThatNeedsUpdated of docsThatNeedUpdating) {
            const docFromTipTap = await services.tiptapDocumentService.getDocument(docThatNeedsUpdated.documentId)
            this.updateDocument(docThatNeedsUpdated.documentId, {
                documentContent: docFromTipTap.content
            })
        }

        return docsThatNeedUpdating.length
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
