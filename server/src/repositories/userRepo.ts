import pool from '../db';
import jsonwebtoken from "jsonwebtoken"
import {config} from "../config/config"

export class UserRepo {
    constructor() {

    }


    async login(userData: any) {
        try {

        } catch (err) {

        }
    }
}







export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM our_story.user');
    console.log(result.rows)
    // const jwt = jsonwebtoken.sign(
    //     {
    //         allowedDocumentNames: ['test_doc']
    //     },
    //     `${config.tiptapProvider.appSecret}`
    // );
    // return jwt;
    return result.rows
};