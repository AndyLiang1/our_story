import { UserRepo } from '../repositories/UserRepo';
import { UserData } from '../types/UserTypes';
export class UserService {
    repo: any;
    constructor() {
        this.repo = new UserRepo();
    }

    async createUser(userData: UserData) {
        try {
            const user = await this.repo.addUser(userData)
            return user
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const users = await this.repo.getAllUsers()
            return users
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await this.repo.getUserByEmail(email)
            return user
        } catch (error) {
            throw error;
        } 
    }
}
