import { Document } from '../models/Document';
import { User } from '../models/User';
import { DocumentData } from '../types/DocumentTypes';

export class DocumentRepo {
    constructor() {}

    async getDocumentsOwnedByUser(userId: string) {
        const docs = await Document.findAll({
            include: [
                {
                    model: User,
                    required: true,
                    where: {
                        userId
                    },
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ]
        });
        return docs;
    }

    async getDocument(documentId: string) {
        const doc = await Document.findByPk(documentId);
        return doc;
    }

    async createDocument(documentData: DocumentData) {
        const doc = await Document.create({ ...documentData });
        return doc;
    }

    async updateDocument(documentId: string, documentData: DocumentData) {
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
