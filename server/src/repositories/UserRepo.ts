import { Document } from '../models/Document';
import { User } from '../models/User';
import { UserCreationData, UserData, UserReturnTypeData } from '../types/UserTypes';

export class UserRepo {
    constructor() {}

    async addUser(userData: UserCreationData) {
        const userRaw = await User.create({ ...userData });
        return userRaw;
    }

    async getUserById(userId: string) {
        const userRaw = await User.findByPk(userId);
        if (userRaw) {
            const user = this.convertRawUsersToUseReturnrType([userRaw])[0];
            return user;
        }
        return null;
    }

    async getUserByEmail(email: string) {
        const userRaw = await User.findOne({
            where: {
                email
            }
        });
        if (userRaw) {
            const user = this.convertRawUsersToUserType([userRaw])[0];
            return user;
        }
        return null;
    }

    async getUsersOwningDocument(documentId: string) {
        const usersRaw = await User.findAll({
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
        const users = this.convertRawUsersToUserType(usersRaw);
        return users;
    }

    convertRawUsersToUserType = (usersRaw: User[]) => {
        const users: UserData[] = [];
        for (const userRaw of usersRaw) {
            const user: UserData = {
                userId: userRaw.getDataValue('userId'),
                cognitoId: userRaw.getDataValue('cognitoId'),
                email: userRaw.getDataValue('email'),
                firstName: userRaw.getDataValue('firstName'),
                lastName: userRaw.getDataValue('lastName')
            };
            users.push(user);
        }
        return users;
    };

    convertRawUsersToUseReturnrType = (usersRaw: User[]) => {
        const users: UserReturnTypeData[] = [];
        for (const userRaw of usersRaw) {
            const user: UserReturnTypeData = {
                email: userRaw.getDataValue('email'),
                firstName: userRaw.getDataValue('firstName'),
                lastName: userRaw.getDataValue('lastName')
            };
            users.push(user);
        }
        return users;
    };
}
