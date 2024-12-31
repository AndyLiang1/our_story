import { Sequelize } from 'sequelize';
import { config } from './config/config';
import pg from 'pg'

// https://github.com/sequelize/sequelize/issues/3000
pg.types.setTypeParser(1114, (str:string) => new Date((str.split(' ').join('T'))+'Z'));

const sequelize = new Sequelize(config.postgres.url, {
    dialect: 'postgres',
    timezone: '+00:00',
});

export const initDb = async () => {
    try {
        
        await sequelize.authenticate();
        console.log('Database connection established');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
};

export default sequelize;
