import sequelize from '../db';
import { documentNotFound } from '../helpers/errorMessage';
import { DocumentRepo } from '../repositories/DocumentRepo';
import { GET_DOCUMENTS_QUERY_OBJECT_TYPE } from '../types/ApiTypes';
import { DocumentCreationAttributes, DocumentData, DocumentsWithCount, DocumentsWithFlags, PartialDocumentUpdateAttributes } from '../types/DocumentTypes';
import { services } from './services';
export class DocumentService {
    documentRepo: DocumentRepo;

    constructor() {
        this.documentRepo = new DocumentRepo();
    }

    async getDocuments(userId: string | null = null, queryObject: any = null) {
        let docsInfo: DocumentData[] | DocumentsWithFlags | DocumentsWithCount = [];

        if (userId) {
            if (queryObject) {
                switch (queryObject.type) {
                    case GET_DOCUMENTS_QUERY_OBJECT_TYPE.NEIGHBOURS:
                        const { documentId } = queryObject;
                        docsInfo = await this.getNeighbouringDocuments(userId, documentId);
                        break;
                    case GET_DOCUMENTS_QUERY_OBJECT_TYPE.CALENDAR:
                        const { startDate, endDate } = queryObject;
                        docsInfo = await this.documentRepo.getDocumentsBetweenDates(userId, startDate, endDate);
                        break;
                    case GET_DOCUMENTS_QUERY_OBJECT_TYPE.ALLSTORIES:
                        const { page } = queryObject;
                        docsInfo = await this.documentRepo.getAllStoriesPaginated(userId, page);
                        const images: (string | null)[] = [];
                        for (const doc of docsInfo.documents) {
                            images.push(doc.images.length ? doc.images[0] : null);
                        }
                        const documentsWithFirstImage = await this.setFirstImagesOfImages(docsInfo.documents);
                        docsInfo.documents = documentsWithFirstImage;
                        break;
                    default:
                        docsInfo = [];
                        break;
                }
            } else {
                docsInfo = await this.documentRepo.getDocuments(userId);
            }
        }
        return docsInfo;
    }

    async setFirstImagesOfImages(docs: any[]) {
        const firstImages = [];
        for (const doc of docs) {
            firstImages.push(doc.images.length ? doc.images[0] : null);
        }
        const firstImagesSigned = await services.imageService.generateDownloadURLs(firstImages);
        for (const [index, doc] of docs.entries()) {
            doc.firstImageWSignedUrl = firstImagesSigned.signedDownloadUrls[index];
        }
        return docs;
    }

    async getDocument(userId: string, documentId: string) {
        if (!documentId) return null;
        let documentData = null;
        const docFromDB: DocumentData | null = await this.documentRepo.getDocument(userId, documentId);
        if (docFromDB) {
            const docFromTipTap = await services.tiptapDocumentService.getDocument(docFromDB.documentId);
            documentData = {
                documentId: docFromDB.documentId,
                title: docFromDB.title,
                documentContent: docFromTipTap,
                createdAt: docFromDB.createdAt,
                eventDate: new Date(docFromDB.eventDate),
                images: docFromDB.images
            };
        }
        return documentData as DocumentData;
    }

    async getNeighbouringDocuments(userId: string, documentId: string | null) {
        const currDocument: DocumentData | null = (await this.getDocument(userId, documentId as string)) as unknown as DocumentData | null;
        const eventDate = currDocument ? currDocument.eventDate : new Date();
        const createdAt = currDocument ? currDocument.createdAt : null;
        const docsFromDBAndFlags: DocumentsWithFlags = await this.documentRepo.getNeighbouringDocuments(userId, eventDate, createdAt);
        return docsFromDBAndFlags;
    }

    async createDocument(documentData: DocumentCreationAttributes, userId: string) {
        return await sequelize.transaction(async (transaction) => {
            const newDocId: string = await this.documentRepo.createDocument({ ...documentData }, transaction);
            await services.documentOwnerService.createDocumentOwner(newDocId, userId, transaction);
            const userPartnerId = await services.partnerService.getPartnerId(userId);
            const partnerHasYouAsPartner = await services.partnerService.partnerUserHasYouAsPartner(userId, userPartnerId);
            if (partnerHasYouAsPartner) await services.documentOwnerService.createDocumentOwner(newDocId, userPartnerId, transaction);
            await services.tiptapDocumentService.createDocument(newDocId, documentData);
            return newDocId;
        });
    }

    async updateDocument(userId: string, documentId: string, documentData: PartialDocumentUpdateAttributes) {
        const data = await this.documentRepo.updateDocument(userId, documentId, documentData);
        return data;
    }

    async deleteDocument(userId: string, documentId: string) {
        await sequelize.transaction(async (t) => {
            const document = await this.getDocument(userId, documentId);
            if (!document) throw Error(documentNotFound(documentId));
            await this.documentRepo.deleteDocument(documentId, t);
            await services.tiptapDocumentService.deleteDocument(documentId);
        });
    }

    async syncDocuments() {
        const docsThatNeedUpdating = await this.documentRepo.getDocumentsToSync();
        for (const docThatNeedsUpdated of docsThatNeedUpdating) {
            const docFromTipTap = await services.tiptapDocumentService.getDocument(docThatNeedsUpdated.documentId);
            this.documentRepo.syncDocument(docThatNeedsUpdated.documentId, {
                documentContent: docFromTipTap.content
            });
        }
        return docsThatNeedUpdating.length;
    }

    async addImages(userId: string, documentId: string, newImageNamesWithGuid: string[]) {
        const docInfo: DocumentData | null = await this.getDocument(userId, documentId);
        if (docInfo) {
            const documentData: PartialDocumentUpdateAttributes = {
                title: docInfo.title,
                documentContent: docInfo.documentContent,
                hasUpdatedInTipTap: docInfo.hasUpdatedInTipTap,
                images: [...docInfo.images, ...newImageNamesWithGuid]
            };
            const data = await this.documentRepo.updateDocument(userId, documentId, documentData);
            return data;
        } else {
            return null;
        }
    }

    async deleteImage(userId: string, documentId: string, imageNameWithGuidToDelete: string) {
        const docInfo: DocumentData | null = await this.getDocument(userId, documentId);
        if (docInfo) {
            const filteredImages = docInfo.images.filter((imageNameWithGuid) => imageNameWithGuid !== imageNameWithGuidToDelete);
            const documentData: PartialDocumentUpdateAttributes = {
                title: docInfo.title,
                documentContent: docInfo.documentContent,
                hasUpdatedInTipTap: docInfo.hasUpdatedInTipTap,
                images: filteredImages
            };
            const data = await this.documentRepo.updateDocument(userId, documentId, documentData);
            return data;
        } else {
            return null;
        }
    }
}
