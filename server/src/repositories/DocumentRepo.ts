import { Op } from '@sequelize/core';
import { Transaction } from 'sequelize';
import { Document } from '../models/Document';
import { User } from '../models/User';
import { DocumentCreationAttributes, DocumentData, PartialDocumentUpdateAttributes } from '../types/DocumentTypes';

export class DocumentRepo {
    constructor() {}

    async getDocuments(userId: string | null, startDate: Date | null, endDate: Date | null, hasUpdated: boolean | null) {
        let whereObjectForDocuments: any = {};
        let whereObjectForUsers: any = {};
        if (startDate != null && endDate != null) {
            whereObjectForDocuments.eventDate = {
                [Op.gte]: new Date(startDate),
                [Op.lte]: new Date(endDate)
            };
        }
        if (userId != null) whereObjectForUsers.userId = userId;
        if (hasUpdated != null) whereObjectForDocuments.hasUpdated = hasUpdated;
        const docs = await Document.findAll({
            include: [
                {
                    model: User,
                    required: true,
                    where: whereObjectForUsers,
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ],
            where: whereObjectForDocuments,
            order: [['createdAt', 'DESC']]
        });
        return docs as unknown as DocumentData[];
    }

    async getLatestDocument() {
        const doc = await Document.findAll({
            order: [['createdAt', 'DESC']],
            limit: 1
        });
        if (doc.length == 0) {
            return null;
        }
        return doc[0];
    }

    async getDocument(userId: string, documentId: string) {
        const doc = await Document.findOne({
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
        return doc as unknown as DocumentData | null;
    }

    async getNeighbouringDocuments(userId: string | null, eventDate: Date, createdAt: Date | null) {
        const isInitialLoad = createdAt === null;
        let documents: DocumentData[] = [];
        let firstDocumentFlag;
        let lastDocumentFlag;
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
            documents = [...mostRecentDocuments] as unknown as DocumentData[];
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
                limit: 7
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
                limit: 7 + 1 // will always find one since it includes itself
            };
            const previousDocsInReversedChronologicalOrder = await Document.findAll(previousDocumentsQueryObject);

            const previousDocuments = [...previousDocsInReversedChronologicalOrder].reverse();
            const nextAndCurrDocuments = await Document.findAll(nextAndCurrDocumentsQueryObject);
            documents = [...previousDocuments, ...nextAndCurrDocuments] as unknown as DocumentData[];
            firstDocumentFlag = previousDocuments.length < 7;
            lastDocumentFlag = nextAndCurrDocuments.length < 8;
        }

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

    async updateDocument(documentId: string, documentData: PartialDocumentUpdateAttributes) {
        const doc = await Document.findByPk(documentId);
        if (doc === null) {
            throw Error(`Document with ID ${documentId} does not exist.`);
        }
        await doc.update({ ...documentData });
        await doc.save();
        await doc.reload();
        return doc;
    }

    async deleteDocument(documentId: string, transaction?: Transaction) {
        await Document.destroy({
            where: {
                documentId
            },
            transaction
        });
    }
}
