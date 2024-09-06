import { User } from '../models/User';
import { UserRepo } from '../repositories/UserRepo';
import { UserData } from '../types/UserTypes';
export class UserService {
    userRepo: UserRepo;
    constructor() {
        this.userRepo = new UserRepo();
    }

    async createUser(userData: UserData) {
        try {
            const user = await this.userRepo.addUser(userData)
            return user
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const users = await this.userRepo.getAllUsers()
            return users
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.userRepo.getUserByEmail(email)
            return user
        } catch (error) {
            throw error;
        } 
    }

    async getUsersOwningDocument(documentId: string) {
        const users = await this.userRepo.getUsersOwningDocument(documentId)
        return users
    }
}
