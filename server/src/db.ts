import { Pool } from 'pg';
import dotenv from 'dotenv';
import {config} from "./config/config"

const pool = new Pool({
    connectionString: config.postgres.url
});

export const initDb = async() => {
    try {
        await pool.query('SELECT 1');
        console.log('Database connection established');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
}

export default pool

