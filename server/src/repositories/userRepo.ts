import pool from '../db';

export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    console.log(result.rows)
    return result.rows;
};