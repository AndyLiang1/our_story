import pool from '../db';
import jsonwebtoken from "jsonwebtoken"
import {config} from "../config/config"
import { UserData } from '../types/UserTypes';
import { User } from '../models/User';

export class UserRepo {
    constructor() {

    }

    async addUser(userData: UserData) {
        const user = await User.create({...userData})
        return user
    }

    async getAllUsers() {
        const users = await User.findAll()
        return users
    }

    async getUserByEmail(email: string) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        return user
    }
}







// export const getAllUsers = async () => {
//     const result = await pool.query('SELECT * FROM our_story.user');
//     console.log(result.rows)
//     const jwt = jsonwebtoken.sign(
//         {
//             allowedDocumentNames: ['test_doc']
//         },
//         `${config.tiptapProvider.appSecret}`
//     );
//     return jwt;
// };