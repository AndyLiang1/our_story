import { Transaction } from 'sequelize';
import { DocumentOwner } from '../models/DocumentOwner';
import { DocumentOwnerData } from '../types/DocumentTypes';

export class DocumentOwnersRepo {
    constructor() {}

    async createDocumentOwner(data: DocumentOwnerData, transaction?: Transaction) {
        const docOwner = await DocumentOwner.create(
            {
                documentId: data.documentId,
                userId: data.userId
            },
            { transaction }
        );
        return docOwner;
    }

    async bulkCreateDocumentOwner(documentOwnerDatas: DocumentOwnerData[]) {
        await DocumentOwner.bulkCreate(documentOwnerDatas);
    }

    async getDocumentsByUserId(userId: string) {
        const docIds = await DocumentOwner.findAll({
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
        await DocumentOwner.destroy({
            where: {
                documentId: data.documentId,
                userId: data.userId
            }
        });
    }
}
