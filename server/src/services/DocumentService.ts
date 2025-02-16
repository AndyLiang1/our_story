import sequelize from '../db';
import { DocumentOwnersRepo } from '../repositories/DocumentOwnersRepo';
import { DocumentRepo } from '../repositories/DocumentRepo';
import { UserRepo } from '../repositories/UserRepo';
import { DocumentCreationAttributes, DocumentData, DocumentOwnerData, DocumentsWithFlags, PartialDocumentUpdateAttributes } from '../types/DocumentTypes';
import { services } from './services';
export class DocumentService {
    documentRepo: DocumentRepo;
    documentOwnerRepo: DocumentOwnersRepo;
    userRepo: UserRepo;

    constructor() {
        this.documentRepo = new DocumentRepo();
        this.documentOwnerRepo = new DocumentOwnersRepo();
        this.userRepo = new UserRepo();
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

    async getDocument(userId: string, documentId: string) {
        if (!documentId) return null;
        let data = null;
        const docFromDB: DocumentData | null = await this.documentRepo.getDocument(userId, documentId);
        if (docFromDB) {
            const docFromTipTap = await services.tiptapDocumentService.getDocument(docFromDB.documentId);

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
        return data as DocumentData;
    }

    async getNeighbouringDocuments(userId: string, documentId: string | null) {
        const currDocument: DocumentData | null = (await this.getDocument(userId, documentId as string)) as unknown as DocumentData | null;
        const eventDate = currDocument ? currDocument.eventDate : new Date();
        const createdAt = currDocument ? currDocument.createdAt : null;
        const docsFromDBAndFlags: DocumentsWithFlags = await this.documentRepo.getNeighbouringDocuments(userId, eventDate, createdAt);
        return docsFromDBAndFlags;
    }

    async createDocument(documentData: DocumentCreationAttributes) {
        return await sequelize.transaction(async (transaction) => {
            const newDocId: string = await this.documentRepo.createDocument({ ...documentData }, transaction);

            await this.documentOwnerRepo.createDocumentOwner(
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
            const docFromTipTap = await services.tiptapDocumentService.getDocument(docThatNeedsUpdated.documentId);
            this.updateDocument(docThatNeedsUpdated.documentId, {
                documentContent: docFromTipTap.content
            });
        }

        return docsThatNeedUpdating.length;
    }

    async addOwners(documentId: string, userIdOfPersonSharing: string, partnerEmail: string) {
        const partner = await this.userRepo.getUserByEmail(partnerEmail);
        const userDocsModel = await this.documentOwnerRepo.getDocumentsByUserId(userIdOfPersonSharing);
        const userDocs = userDocsModel.map((userDocModel) => userDocModel.getDataValue('documentId'));
        const userActuallyOwnsDocument = userDocs.includes(documentId);
        let data = null;
        if (userActuallyOwnsDocument && partner) {
            data = await this.documentOwnerRepo.createDocumentOwner({
                documentId,
                userId: partner.getDataValue('userId')
            });
        }

        return data;
    }

    async deleteOwner(data: DocumentOwnerData) {
        await this.documentOwnerRepo.deleteDocumentOwner(data);
    }

    async addImages(userId: string, documentId: string, newImageNamesWithGuid: string[]) {
        try {
            const docInfo: DocumentData | null = await this.getDocument(userId, documentId);
            if (docInfo) {
                const documentData: PartialDocumentUpdateAttributes = {
                    title: docInfo.title,
                    documentContent: docInfo.documentContent,
                    // hasUpdatedInTipTap: docInfo?.hasUpdatedInTipTap,
                    images: [...docInfo.images, ...newImageNamesWithGuid]
                };
                const data = await this.documentRepo.updateDocument(documentId, documentData);
                return data;
            } else {
                return null;
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error('Error updating document:', e.message);
            } else {
                console.error('Unknown error occurred:', e);
            }
        }
    }
    async deleteImage(userId: string, documentId: string, imageNameWithGuidToDelete: string) {
        try {
            const docInfo: DocumentData | null = await this.getDocument(userId, documentId);
            if (docInfo) {
                const filteredImages = docInfo.images.filter((imageNameWithGuid) => imageNameWithGuid !== imageNameWithGuidToDelete);
                const documentData: PartialDocumentUpdateAttributes = {
                    title: docInfo.title,
                    documentContent: docInfo.documentContent,
                    // hasUpdatedInTipTap: docInfo?.hasUpdatedInTipTap,
                    images: filteredImages
                };
                const data = await this.documentRepo.updateDocument(documentId, documentData);
                return data;
            } else {
                return null;
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error('Error updating document:', e.message);
            } else {
                console.error('Unknown error occurred:', e);
            }
        }
    }
}
