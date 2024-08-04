import pool from '../db';
import jsonwebtoken from "jsonwebtoken"
import {config} from "../config/config"
export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    console.log(result.rows)
    const jwt = jsonwebtoken.sign(
        {
            allowedDocumentNames: ['test_doc']
        },
        `${config.tiptapProvider.appSecret}`
    );
    return jwt;
};