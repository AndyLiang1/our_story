import { DataTypes, Model } from 'sequelize';
import { config } from '../config/config';
import sequelize from '../db';
import { User } from './User';

export class Partner extends Model {}

Partner.init(
    {
        userId1: {
            type: DataTypes.TEXT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: User,
                key: 'userId'
            }
        },
        userId2: {
            type: DataTypes.TEXT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: User,
                key: 'userId'
            }
        },

        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    },
    {
        sequelize,
        modelName: 'Partner',
        tableName: 'partners',
        schema: config.postgres.dbSchema,
        timestamps: true
    }
);

User.belongsToMany(User, {
    through: Partner,
    as: 'Partner1',
    foreignKey: 'userId1'
});
User.belongsToMany(User, {
    through: Partner,
    as: 'Partner2',
    foreignKey: 'userId2'
});
