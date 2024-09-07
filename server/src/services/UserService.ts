import { User } from '../models/User';
import { UserRepo } from '../repositories/UserRepo';
import { UserData } from '../types/UserTypes';
export class UserService {
    userRepo: UserRepo;
    constructor() {
        this.userRepo = new UserRepo();
    }

    async createUser(userData: UserData) {
        const user = await this.userRepo.addUser(userData)
        return user

    }

    async getAllUsers() {
        const users = await this.userRepo.getAllUsers()
        return users
    }

    async getUserById(userId: string) {
        const user = await this.userRepo.getUserById(userId)
        return user
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.userRepo.getUserByEmail(email)
        return user
    }

    async getUsersOwningDocument(documentId: string) {
        const users = await this.userRepo.getUsersOwningDocument(documentId)
        return users
    }
}
