import express, { NextFunction, Request, Response, Router } from 'express';
import { BadRequestError } from '../helpers/ErrorHelpers';
import { JwtVerifier } from '../middleware/JwtVerifier';
import { services } from '../services/services';
import { CustomRequest, GET_DOCUMENTS_QUERY_OBJECT_TYPE } from '../types/ApiTypes';
import { DocumentCreationAttributes, PartialDocumentUpdateAttributes } from '../types/DocumentTypes';

export class DocumentController {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.router.use(JwtVerifier.verifyCollabToken);
        this.router.get('/', this.getDocuments.bind(this));
        this.router.get('/:documentId', this.getDocument.bind(this));
        this.router.post('/', this.createDocument.bind(this));
        this.router.put('/:documentId', this.updateDocument.bind(this));
        this.router.delete('/:documentId', this.deleteDocument.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/documents', this.router);
    }

    async getDocuments(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).userId;
        let queryObject: any = {};
        if (req.query.neighbouringDocs && req.query.eventDate) {
            queryObject = {
                type: GET_DOCUMENTS_QUERY_OBJECT_TYPE.NEIGHBOURS,
                documentId: req.query.documentId !== 'null' ? (req.query.documentId as string) : null
            };
        } else if (req.query.startDate && req.query.endDate) {
            queryObject = {
                type: GET_DOCUMENTS_QUERY_OBJECT_TYPE.CALENDAR,
                startDate: req.query.startDate ? new Date(req.query.startDate as string) : null,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : null
            };
        } else {
            queryObject = {
                type: GET_DOCUMENTS_QUERY_OBJECT_TYPE.ALLSTORIES,
                page: req.query.page ? (parseInt(req.query.page as string) as number) : null
            };
        }

        if (userId) {
            const docsInfo = await services.documentService.getDocuments(userId, queryObject);
            res.status(200).json(docsInfo);
        } else {
            throw new BadRequestError();
        }
    }

    async getDocument(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).userId;
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
            throw new BadRequestError();
        }
    }

    async createDocument(req: Request, res: Response, next: NextFunction) {
        const defaultDocumentContent = {
            type: 'doc',
            content: []
        };
        const userId = (req as CustomRequest).userId;
        const { documentData } = req.body;
        const createDocumentData: DocumentCreationAttributes = {
            title: documentData.title,
            documentContent: defaultDocumentContent,
            createdByUserId: userId,
            eventDate: documentData.eventDate,
            images: []
        };
        const newDocId = await services.documentService.createDocument(createDocumentData, userId);
        res.status(201).json(newDocId);
    }

    async updateDocument(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).userId;
        const { documentId } = req.params;
        const reqBody = req.body;
        const documentData: PartialDocumentUpdateAttributes = {
            title: reqBody?.title,
            hasUpdatedInTipTap: reqBody?.hasUpdatedInTipTap,
            images: reqBody?.newImageNamesWithGuid
        };

        if (documentId) {
            const doc = await services.documentService.updateDocument(userId, documentId, documentData);
            res.status(200).json(doc);
        } else {
            throw new BadRequestError();
        }
    }

    async deleteDocument(req: Request, res: Response, next: NextFunction) {
        const userId = (req as CustomRequest).userId;
        const { documentId } = req.params;
        if (documentId) {
            await services.documentService.deleteDocument(userId, documentId);
            res.status(200).json({
                message: `Document with ID ${documentId} is deleted successfully.`
            });
        } else {
            throw new BadRequestError();
        }
    }
}
