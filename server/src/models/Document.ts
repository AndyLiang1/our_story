import { DataTypes, Model } from 'sequelize';
import { config } from '../config/config';
import sequelize from '../db';
import { User } from './User';

export class Document extends Model {}

Document.init(
    {
        documentId: {
            type: DataTypes.TEXT,
            primaryKey: true,
            defaultValue: sequelize.literal("concat('doc-', gen_random_uuid())")
        },
        title: {
            type: DataTypes.TEXT
        },
        content: {
            type: DataTypes.TEXT
        },
        createdByUserId: {
            type: DataTypes.TEXT,
            allowNull: false,
            references: {
                model: User,
                key: 'userId'
            }
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.TEXT)
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
        modelName: 'Document',
        tableName: 'document',
        schema: config.postgres.dbSchema,
        timestamps: true
    }
);
