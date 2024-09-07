import pool from '../db';
import jsonwebtoken from "jsonwebtoken"
import {config} from "../config/config"
import { UserData } from '../types/UserTypes';
import { User } from '../models/User';
import { Document } from '../models/Document';

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

    async getUserById(userId: string) {
        const user = await User.findByPk(userId)
        return user
    }

    async getUserByEmail(email: string) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        return user
    }

    async getUsersOwningDocument(documentId: string) {
        const users = await User.findAll({
            include: [{
                model: Document,
                required: true,
                where: {
                    documentId
                },
                through: {
                    attributes: []
                },
                attributes: []
            }],
        })
        return users
    }
}