import { Partner } from '../models/Partner';

export class PartnerRepo {
    constructor() {}

    async createPartner(userId1: string, userId2: string) {
        await Partner.create({
            userId1,
            userId2
        });
    }

    async getPartnerId(userIdWhosePartnersWeWant: string) {
        const partner = await Partner.findOne({
            where: {
                userId1: userIdWhosePartnersWeWant
            }
        });
        return partner?.getDataValue('userId2');
    }

    async deletePartner(userId1: string, userId2: string) {
        await Partner.destroy({
            where: {
                userId1,
                userId2
            }
        });
    }
}
