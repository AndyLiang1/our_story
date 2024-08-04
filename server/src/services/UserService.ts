import { UserRepo } from '../repositories/UserRepo';
export class UserService {
    repo: any;
    constructor() {
        this.repo = new UserRepo();
    }

    async login(userData: any) {
        try {
            await this.repo.login(userData);
        } catch (error) {
            throw error;
        }
    }
}
