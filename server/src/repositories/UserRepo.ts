import { Document } from '../models/Document';
import { User } from '../models/User';
import { UserCreationData } from '../types/UserTypes';

export class UserRepo {
    constructor() {}

    async addUser(userData: UserCreationData) {
        const user = await User.create({ ...userData });
        return user;
    }

    async getAllUsers() {
        const users = await User.findAll();
        return users;
    }

    async getUserById(userId: string) {
        const user = await User.findByPk(userId);
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await User.findOne({
            where: {
                email
            }
        });
        return user;
    }

    async getUsersOwningDocument(documentId: string) {
        const users = await User.findAll({
            include: [
                {
                    model: Document,
                    required: true,
                    where: {
                        documentId
                    },
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ]
        });
        return users;
    }
}
