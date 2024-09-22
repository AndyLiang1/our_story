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
        documentContent: {
            type: DataTypes.JSONB
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
        hasUpdatedInTipTap: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        eventDate: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.literal('CURRENT_DATE')
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
