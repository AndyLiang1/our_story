import { UserRepo } from '../repositories/UserRepo';
import { UserCreationData } from '../types/UserTypes';
export class UserService {
    userRepo: UserRepo;
    constructor() {
        this.userRepo = new UserRepo();
    }

    async createUser(userData: UserCreationData) {
        const user = await this.userRepo.addUser(userData);
        return user;
    }

    async getUserById(userId: string) {
        const user = await this.userRepo.getUserById(userId);
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepo.getUserByEmail(email);
        return user;
    }

    async getUsersOwningDocument(documentId: string) {
        const users = await this.userRepo.getUsersOwningDocument(documentId);
        return users;
    }
}
