import { DataTypes, Model } from 'sequelize';
import { config } from '../config/config';
import sequelize from '../db';

export class User extends Model {}

User.init(
    {
        userId: {
            type: DataTypes.TEXT,
            primaryKey: true,
            defaultValue: sequelize.literal("concat('user-', gen_random_uuid())")
        },
        cognitoId: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        firstName: {
            type: DataTypes.TEXT
        },
        lastName: {
            type: DataTypes.TEXT
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        fullName: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`;
            },
            set(value) {
                throw new Error('Do not try to set the `fullName` value!');
            }
        }
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'user',
        schema: config.postgres.dbSchema,
        timestamps: true
    }
);
