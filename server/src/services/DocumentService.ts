import moment from 'moment';
import sequelize from '../db';
import { DocumentOwnersRepo } from '../repositories/DocumentOwnersRepo';
import { DocumentRepo } from '../repositories/DocumentRepo';
import {
    DocumentCreationAttributes,
    DocumentData,
    DocumentOwnerData,
    DocumentsWithFlags,
    PartialDocumentUpdateAttributes
} from '../types/DocumentTypes';
import { services } from './services';
export class DocumentService {
    documentRepo: DocumentRepo;
    documentOwnerRepo: DocumentOwnersRepo;

    constructor() {
        this.documentRepo = new DocumentRepo();
        this.documentOwnerRepo = new DocumentOwnersRepo();
    }

    async getDocuments(
        userId: string | null = null,
        startDate: Date | null = null,
        endDate: Date | null = null,
        neighbouringDocuments: boolean | null = null,
        documentId: string | null = null,
        hasUpdated: boolean | null = null
    ) {
        let docs: DocumentData[] | DocumentsWithFlags;
        if (neighbouringDocuments && userId) {
            docs = await this.getNeighbouringDocuments(userId, documentId);
        } else {
            docs = await this.documentRepo.getDocuments(userId, startDate, endDate, hasUpdated);
        }
        return docs;
    }

    async getLatestDocument() {
        const doc = await this.documentRepo.getLatestDocument();
        return doc;
    }

    async getDocument(documentId: string) {
        if(!documentId) return null
        const docFromDB: DocumentData | null = await this.documentRepo.getDocument(documentId);

        const docFromTipTap = await services.tiptapDocumentService.getDocument(documentId);
        let data = null;
        if (docFromDB) {
            data = {
                documentId: docFromDB.documentId,
                title: docFromDB.title,
                documentContent: docFromTipTap,
                createdAt: docFromDB.createdAt,
                updatedAt: docFromDB.updatedAt,
                eventDate: new Date(docFromDB.eventDate),
                images: docFromDB.images,
                createdByUserId: docFromDB.createdByUserId
            };
        }
        return data;
    }

    async getNeighbouringDocuments(userId: string, documentId: string | null) {
        const currDocument: DocumentData | null = (await this.getDocument(
            documentId as string
        )) as unknown as DocumentData | null;
        const eventDate = currDocument ? currDocument.eventDate : new Date();
        const createdAt = currDocument ? currDocument.createdAt : null;
        const docsFromDBAndFlags: DocumentsWithFlags =
            await this.documentRepo.getNeighbouringDocuments(userId, eventDate, createdAt);
        return docsFromDBAndFlags;
    }

    async createDocument(documentData: DocumentCreationAttributes) {
        return await sequelize.transaction(async (transaction) => {
            const newDocId: string = await this.documentRepo.createDocument(
                {...documentData},
                transaction
            );

            const owner = await this.documentOwnerRepo.creatDocumentOwner(
                {
                    documentId: newDocId,
                    userId: documentData.createdByUserId
                },
                transaction
            );

            await services.tiptapDocumentService.createDocument(newDocId, documentData);
            return newDocId;
        });
    }

    async updateDocument(documentId: string, documentData: PartialDocumentUpdateAttributes) {
        const data = await this.documentRepo.updateDocument(documentId, documentData);
        return data;
    }

    async deleteDocument(documentId: string) {
        await sequelize.transaction(async (t) => {
            await this.documentRepo.deleteDocument(documentId, t);
            await services.tiptapDocumentService.deleteDocument(documentId);
        });
    }

    async syncDocuments() {
        const docsThatNeedUpdating = await this.documentRepo.getDocuments(null, null, null, true);

        for (const docThatNeedsUpdated of docsThatNeedUpdating) {
            const docFromTipTap = await services.tiptapDocumentService.getDocument(
                docThatNeedsUpdated.documentId
            );
            this.updateDocument(docThatNeedsUpdated.documentId, {
                documentContent: docFromTipTap.content
            });
        }

        return docsThatNeedUpdating.length;
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
