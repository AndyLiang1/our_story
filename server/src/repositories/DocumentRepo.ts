import { Op } from '@sequelize/core';
import { Transaction } from 'sequelize';
import { documentNotFound } from '../helpers/ErrorHelpers';
import { Document } from '../models/Document';
import { User } from '../models/User';
import { DocumentCreationAttributes, DocumentData, PartialDocumentUpdateAttributes } from '../types/DocumentTypes';

export class DocumentRepo {
    constructor() {}

    async getAllStoriesPaginated(userId: string, page: number) {
        const limit = 20;
        const offset = (page - 1) * limit;

        const docsInfo = await Document.findAndCountAll({
            include: [
                {
                    model: User,
                    required: true,
                    where: { userId },
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ],
            order: [
                ['eventDate', 'DESC'],
                ['createdAt', 'DESC']
            ],
            limit,
            offset
        });
        const documents: DocumentData[] = this.convertRawDocumentModelsToDocumentDataArray(docsInfo.rows);

        return {
            documents,
            total: docsInfo.count,
            page,
            totalPages: Math.ceil(docsInfo.count / limit)
        };
    }

    async getDocumentsToSync() {
        const documentsRaw: Document[] = await Document.findAll({
            include: [
                {
                    model: User,
                    required: true,
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ],
            where: { hasUpdatedInTipTap: true },
            order: [
                ['eventDate', 'DESC'],
                ['createdAt', 'DESC']
            ]
        });
        const documents: DocumentData[] = this.convertRawDocumentModelsToDocumentDataArray(documentsRaw);
        return documents;
    }

    async getDocumentsBetweenDates(userId: string, startDate: Date, endDate: Date) {
        const whereObjectForDocuments = {
            eventDate: {
                [Op.gte]: new Date(startDate),
                [Op.lte]: new Date(endDate)
            }
        };
        const documentsRaw: Document[] = await Document.findAll({
            include: [
                {
                    model: User,
                    required: true,
                    where: { userId },
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ],
            where: whereObjectForDocuments,
            order: [
                ['eventDate', 'DESC'],
                ['createdAt', 'DESC']
            ]
        });
        const documents: DocumentData[] = this.convertRawDocumentModelsToDocumentDataArray(documentsRaw);
        return documents;
    }

    async getDocuments(userId: string) {
        const documentsRaw: Document[] = await Document.findAll({
            include: [
                {
                    model: User,
                    required: true,
                    where: { userId },
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ],
            order: [
                ['eventDate', 'DESC'],
                ['createdAt', 'DESC']
            ]
        });
        const documents: DocumentData[] = this.convertRawDocumentModelsToDocumentDataArray(documentsRaw);
        return documents;
    }

    async getDocument(userId: string, documentId: string) {
        const documentRaw: Document | null = await Document.findOne({
            where: {
                documentId
            },
            include: [
                {
                    model: User,
                    required: true,
                    where: { userId: userId },
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ]
        });
        if (documentRaw) {
            const documents: DocumentData[] = this.convertRawDocumentModelsToDocumentDataArray([documentRaw]);
            return documents[0];
        }
        return null;
    }

    async getNeighbouringDocuments(userId: string | null, eventDate: Date, createdAt: Date | null) {
        const isInitialLoad = createdAt === null;
        let documentsRaw: Document[] = [];
        let firstDocumentFlag;
        let lastDocumentFlag;
        const numDocsToFetchLeftDirection = 3;
        const numDocsToFetchRightDirection = 4; // including current doca
        const queryObject: any = {
            include: [
                {
                    model: User,
                    required: true,
                    where: { userId: userId },
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ]
        };
        if (isInitialLoad) {
            const mostRecentQueryObject = {
                ...queryObject,
                where: {
                    eventDate: { [Op.lte]: new Date(eventDate).toISOString().split('T')[0] }
                },
                order: [
                    ['eventDate', 'DESC'],
                    ['createdAt', 'DESC']
                ],
                limit: 10 + 1 // includes itself
            };
            const mostRecentDocsInReversedChronologicalOrder = await Document.findAll(mostRecentQueryObject);
            const mostRecentDocuments = [...mostRecentDocsInReversedChronologicalOrder].reverse();
            documentsRaw = [...mostRecentDocuments];
            firstDocumentFlag = mostRecentDocuments.length < 4;
            lastDocumentFlag = true;
        } else {
            const previousDocumentsQueryObject = {
                ...queryObject,
                where: {
                    [Op.or]: [
                        { eventDate: { [Op.lt]: new Date(eventDate).toISOString().split('T')[0] } },
                        {
                            [Op.and]: [{ eventDate: new Date(eventDate).toISOString().split('T')[0] }, { createdAt: { [Op.lt]: createdAt } }]
                        }
                    ]
                },
                order: [
                    ['eventDate', 'DESC'],
                    ['createdAt', 'DESC']
                ],
                limit: numDocsToFetchLeftDirection
            };

            const nextAndCurrDocumentsQueryObject = {
                ...queryObject,
                where: {
                    [Op.or]: [
                        { eventDate: { [Op.gt]: new Date(eventDate).toISOString().split('T')[0] } },
                        {
                            [Op.and]: [{ eventDate: new Date(eventDate).toISOString().split('T')[0] }, { createdAt: { [Op.gte]: createdAt } }]
                        }
                    ]
                },
                order: [
                    ['eventDate', 'ASC'],
                    ['createdAt', 'ASC']
                ],
                limit: numDocsToFetchRightDirection // will always find one since it includes itself
            };
            const previousDocsInReversedChronologicalOrder = await Document.findAll(previousDocumentsQueryObject);

            const previousDocuments = [...previousDocsInReversedChronologicalOrder].reverse();
            const nextAndCurrDocuments = await Document.findAll(nextAndCurrDocumentsQueryObject);
            documentsRaw = [...previousDocuments, ...nextAndCurrDocuments];
            firstDocumentFlag = previousDocuments.length < numDocsToFetchLeftDirection;
            lastDocumentFlag = nextAndCurrDocuments.length < numDocsToFetchRightDirection;
        }
        const documents: DocumentData[] = this.convertRawDocumentModelsToDocumentDataArray(documentsRaw);

        return {
            documents,
            firstDocumentFlag,
            lastDocumentFlag
        };
    }

    async createDocument(documentData: DocumentCreationAttributes, transaction?: Transaction) {
        const doc = await Document.create({ ...documentData, eventDate: new Date(documentData.eventDate).toISOString().split('T')[0] }, { transaction });
        return doc.getDataValue('documentId');
    }

    // similar to updateDocument, but no userId check
    async syncDocument(documentId: string, documentData: PartialDocumentUpdateAttributes) {
        const documentRaw = await Document.findByPk(documentId);

        if (documentRaw === null) {
            throw Error(documentNotFound(documentId));
        }
        await documentRaw.update({ ...documentData });
        await documentRaw.save();
        await documentRaw.reload();
        const documents: DocumentData[] = this.convertRawDocumentModelsToDocumentDataArray([documentRaw]);
        return documents[0];
    }

    async updateDocument(userId: string, documentId: string, documentData: PartialDocumentUpdateAttributes) {
        const documentRaw: Document | null = await Document.findOne({
            where: {
                documentId
            },
            include: [
                {
                    model: User,
                    required: true,
                    where: { userId: userId },
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ]
        });
        if (documentRaw === null) {
            throw Error(documentNotFound(documentId));
        }
        await documentRaw.update({ ...documentData });
        await documentRaw.save();
        await documentRaw.reload();
        const documents: DocumentData[] = this.convertRawDocumentModelsToDocumentDataArray([documentRaw]);
        return documents[0];
    }

    async deleteDocument(documentId: string, transaction?: Transaction) {
        await Document.destroy({
            where: {
                documentId
            },
            transaction
        });
    }

    convertRawDocumentModelsToDocumentDataArray = (rawDocuments: Document[]) => {
        const documents: DocumentData[] = [];
        for (const rawDocument of rawDocuments) {
            const document: DocumentData = {
                documentId: rawDocument.getDataValue('documentId'),
                title: rawDocument.getDataValue('title'),
                documentContent: rawDocument.getDataValue('documentContent'),
                eventDate: rawDocument.getDataValue('eventDate'),
                createdAt: rawDocument.getDataValue('createdAt'),
                images: rawDocument.getDataValue('images'),
                hasUpdatedInTipTap: rawDocument.getDataValue('hasUpdatedInTipTap')
            };
            documents.push(document);
        }
        return documents;
    };
}
