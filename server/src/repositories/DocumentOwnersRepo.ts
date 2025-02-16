import { Transaction } from 'sequelize';
import { DocumentOwners } from '../models/DocumentOwners';
import { DocumentOwnerData } from '../types/DocumentTypes';

export class DocumentOwnersRepo {
    constructor() {}

    async createDocumentOwner(data: DocumentOwnerData, transaction?: Transaction) {
        const docOwner = await DocumentOwners.create(
            {
                documentId: data.documentId,
                userId: data.userId
            },
            { transaction }
        );
        return docOwner;
    }

    async getDocumentsByUserId(userId: string) {
        const docIds = await DocumentOwners.findAll({
            where: {
                userId
            },
            attributes: ['documentId']
        });
        return docIds;
    }

    // async getOwnersByDocumentId(documentId: string) {
    //     const owners = await DocumentOwners.findAll({
    //         where: {
    //             documentId
    //         },
    //         attributes: ['userId']
    //     });
    //     return owners;
    // }

    async deleteDocumentOwner(data: DocumentOwnerData) {
        await DocumentOwners.destroy({
            where: {
                documentId: data.documentId,
                userId: data.userId
            }
        });
    }
}
