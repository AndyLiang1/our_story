import { Pool } from 'pg';
import dotenv from 'dotenv';
import {config} from "./config/config"
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(config.postgres.url)

export const initDb = async() => {
    try {
        await sequelize.authenticate()
        console.log('Database connection established');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
}

export default sequelize

