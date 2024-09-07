import { DataTypes, Model } from 'sequelize';
import { config } from '../config/config';
import sequelize from '../db';
import { Document } from './Document';
import { User } from './User';

export class DocumentOwners extends Model {}

DocumentOwners.init(
    {
        documentId: {
            type: DataTypes.TEXT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Document,
                key: 'documentId'
            }
        },
        userId: {
            type: DataTypes.TEXT,
            primaryKey: true,
            allowNull: false,
            references: {
                model: User,
                key: 'userId'
            }
        }
    },
    {
        sequelize,
        modelName: 'DocumentOwners',
        tableName: 'documentOwners',
        schema: config.postgres.dbSchema,
        timestamps: false
    }
);

Document.belongsToMany(User, {
    through: DocumentOwners,
    foreignKey: 'documentId'
});
User.belongsToMany(Document, {
    through: DocumentOwners,
    foreignKey: 'userId'
});
