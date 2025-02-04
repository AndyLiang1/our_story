import express, { NextFunction, Request, Response, Router } from 'express';
import { JwtVerifier } from '../middleware/JwtVerifier';
import { services } from '../services/services';
import { DocumentCreationAttributes, PartialDocumentUpdateAttributes } from '../types/DocumentTypes';

export class DocumentController {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.router.use(JwtVerifier.verifyCollabToken);
        // the this.login.bind(this) is basically saying
        // when I hit /api/users in a get request, I am going
        // to call the login function
        // https://stackoverflow.com/questions/40018472/implement-express-controller-class-with-typescript
        this.router.get('/', this.getDocuments.bind(this));
        this.router.get('/:documentId', this.getDocument.bind(this));
        this.router.post('/', this.createDocument.bind(this));
        this.router.put('/:documentId', this.updateDocument.bind(this));
        this.router.delete('/:documentId', this.deleteDocument.bind(this));

        this.router.get('/:documentId/owners', this.getDocumentOwners.bind(this));
        this.router.put('/:documentId/owners', this.addDocumentOwners.bind(this));
        this.router.delete('/:documentId/owners/:userId', this.deleteDocumentOwner.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/documents', this.router);
    }

    async getDocuments(req: Request, res: Response, next: NextFunction) {
        const userId = req.query.userId ? (req.query.userId as string) : null;
        const startDate = req.query.startDate ? new Date(req.query.startDate as string) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate as string) : null;
        const neighbouringDocs = req.query.neighbouringDocs === 'true' ? true : null;
        const documentId = req.query.documentId !== 'null' ? (req.query.documentId as string) : null;

        if (userId) {
            const docs = await services.documentService.getDocuments(userId, startDate, endDate, neighbouringDocs, documentId, null);
            res.status(200).json(docs);
        } else {
            res.status(400).json({
                message: 'userId must be provided.'
            });
        }
    }

    async getDocument(req: Request, res: Response, next: NextFunction) {
        const userId = req.query.userId ? (req.query.userId as string) : null;
        const { documentId } = req.params;
        if (documentId && userId) {
            const doc = await services.documentService.getDocument(userId, documentId);
            if (doc === null) {
                res.status(404).json({
                    message: `Document with ID ${documentId} does not exist.`
                });
            } else {
                res.status(200).json(doc);
            }
        } else {
            res.status(400).json({
                message: 'documentId and userId must be provided.'
            });
        }
    }

    async createDocument(req: Request, res: Response, next: NextFunction) {
        const defaultDocumentContent = {
            type: 'doc',
            content: []
        };
        const reqBody = req.body;
        const documentData: DocumentCreationAttributes = {
            title: reqBody.title,
            documentContent: defaultDocumentContent,
            createdByUserId: reqBody.createdByUserId,
            eventDate: reqBody.eventDate,
            images: []
        };
        const doc = await services.documentService.createDocument(documentData);
        res.status(201).json(doc);
    }

    // TODO MAKE SURE USERID IS USED TOO
    async updateDocument(req: Request, res: Response, next: NextFunction) {
        const { documentId } = req.params;
        const reqBody = req.body;
        const documentData: PartialDocumentUpdateAttributes = {
            title: reqBody?.title,
            documentContent: reqBody?.documentContent,
            hasUpdatedInTipTap: reqBody?.hasUpdatedInTipTap,
            images: reqBody?.newImageNamesWithGuid
        };

        if (documentId) {
            const doc = await services.documentService.updateDocument(documentId, documentData);
            res.status(200).json(doc);
        } else {
            res.status(400).json({
                message: 'documentId must be provided.'
            });
        }
    }

    // TODO MAKE SURE USERID IS USED TOO
    async deleteDocument(req: Request, res: Response, next: NextFunction) {
        const { documentId } = req.params;
        if (documentId) {
            await services.documentService.deleteDocument(documentId);
            res.status(200).json({
                message: `Document with ID ${documentId} is deleted successfully.`
            });
        } else {
            res.status(400).json({
                message: 'documentId must be provided.'
            });
        }
    }

    async getDocumentOwners(req: Request, res: Response, next: NextFunction) {
        const { documentId } = req.params;
        if (documentId) {
            const users = await services.userService.getUsersOwningDocument(documentId);
            res.status(200).json(users);
        } else {
            res.status(400).json({
                message: 'documentId must be provided.'
            });
        }
    }

    async addDocumentOwners(req: Request, res: Response, next: NextFunction) {
        const { documentId } = req.params;
        const owners = req.body.owners;
        if (documentId) {
            const docOwners = await services.documentService.addOwners(documentId, owners);
            res.status(200).json(docOwners);
        } else {
            res.status(400).json({
                message: 'documentId must be provided.'
            });
        }
    }

    async deleteDocumentOwner(req: Request, res: Response, next: NextFunction) {
        const { documentId, userId } = req.params;
        if (documentId && userId) {
            await services.documentService.deleteOwner({
                documentId,
                userId
            });
            res.status(200).json({
                message: `Owner with userId ${userId} is removed from document successfully.`
            });
        } else {
            res.status(400).json({
                message: 'Both documentId and userId must be provided.'
            });
        }
    }
}
