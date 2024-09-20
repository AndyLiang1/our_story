import { Op } from '@sequelize/core';
import { Document } from '../models/Document';
import { User } from '../models/User';
import { DocumentCreationAttributes, DocumentData, PartialDocumentQueryParams, PartialDocumentUpdateAttributes } from '../types/DocumentTypes';
import { DocumentCreationAttributes, DocumentData } from '../types/DocumentTypes';

export class DocumentRepo {
    constructor() {}

    // async getDocuments(queryParams: PartialDocumentQueryParams) {
    //     const docs = await Document.findAll({
    //         include: [
    //             {
    //                 model: User,
    //                 required: true,
    //                 where: {
    //                     userId,
    //                     hasUpdated
    //                 }
    //             }
    //         ]
    //     })
    // }

    async getDocumentsOwnedByUser(userId: string, startDate: string, endDate: string) {
        console.log(new Date(startDate));
        const whereObject =
            !startDate && !endDate
                ? {}
                : {
                      createdAt: {
                          [Op.gte]: new Date(startDate),
                          [Op.lte]: new Date(endDate)
                      }
                  };
        const docs = await Document.findAll({
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
            where: whereObject,
            order: [['createdAt', 'DESC']]
        });
        return docs as unknown as DocumentData[];
    }

    async getDocument(documentId: string) {
        const doc = await Document.findByPk(documentId);
        return doc as unknown as DocumentData | null;
    }

    async createDocument(documentData: DocumentCreationAttributes) {
        const doc = await Document.create({ ...documentData });
        return doc;
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

    async deleteDocument(documentId: string) {
        await Document.destroy({
            where: {
                documentId
            }
        });
    }
}
