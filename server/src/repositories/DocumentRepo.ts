import { Op } from '@sequelize/core';
import { Document } from '../models/Document';
import { User } from '../models/User';
import { DocumentCreationAttributes, DocumentData, PartialDocumentQueryParams, PartialDocumentUpdateAttributes } from '../types/DocumentTypes';
import { Transaction } from 'sequelize';

export class DocumentRepo {
    constructor() {}

 
    async getDocuments(userId: string | null, startDate: string | null, endDate: string | null, hasUpdated: boolean | null) {
        let whereObjectForDocuments: any = {}
        let whereObjectForUsers: any = {}
        if (startDate != null && endDate != null) {
            whereObjectForDocuments.createdAt = {
                [Op.gte]: new Date(startDate), 
                [Op.lte]: new Date(endDate)    
            };
        }
        if(userId != null) whereObjectForUsers.userId = userId
        if(hasUpdated != null) whereObjectForDocuments.hasUpdated = hasUpdated

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

    async getDocument(documentId: string) {
        const doc = await Document.findByPk(documentId);
        return doc as unknown as DocumentData | null;
    }

    async createDocument(
        documentData: DocumentCreationAttributes, transaction?: Transaction
    ) {
        const doc = await Document.create(
            { ...documentData },
            { transaction }
        );
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
