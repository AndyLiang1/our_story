import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import { config } from "../config/config";
import { User } from "./User";

export class Document extends Model {}

Document.init(
    {
        documentId: {
            type: DataTypes.TEXT,
            primaryKey: true,
            defaultValue: sequelize.literal("concat('doc-', gen_random_uuid())")
        },
        title: {
            type: DataTypes.TEXT,
        },
        content: {
            type: DataTypes.TEXT,
        },
        createdByUserId: {
            type: DataTypes.TEXT,
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
        modelName: 'Document',
        tableName: 'document',
        schema: config.postgres.dbSchema,
        timestamps: true
    }
)
