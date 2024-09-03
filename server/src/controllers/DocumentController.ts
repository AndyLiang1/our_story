import express, { Request, Response, NextFunction, Router } from 'express';
import { services } from '../services/services';
import { DocumentData } from '../types/DocumentTypes';

export class DocumentController {
    router: Router;
    constructor() {
        this.router = express.Router();
        // the this.login.bind(this) is basically saying
        // when I hit /api/users in a get request, I am going
        // to call the login function
        // https://stackoverflow.com/questions/40018472/implement-express-controller-class-with-typescript
        this.router.get('/', this.getDocuments.bind(this));
        this.router.get('/:documentId', this.getDocument.bind(this));
        this.router.post('/', this.createDocument.bind(this));
        this.router.put('/:documentId', this.updateDocument.bind(this));
        this.router.delete('/:documentId', this.deleteDocument.bind(this));

        this.router.get('/:documentId/owners', this.getDocumentOwners.bind(this))
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/api/documents', this.router);
    }

    async getDocuments(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.query.userId
            if (userId) {
                const docs = await services.documentService.getDocumentsOwnedByUser(userId as string)
                res.status(200).json(docs)
            } else {
                res.status(400).json({
                    message: "userId must be provided."
                })
            }
        } catch (error) {
            res.status(500).json({
                message: "Unable to get documents. Internal server error."
            })
            console.error(error)
        }
        
    }

    async getDocument(req: Request, res: Response, next: NextFunction) {
        const { documentId } = req.params
        if (documentId) {
            const doc = await services.documentService.getDocument(documentId)
            if (doc === null) {
                res.status(404).json({
                    message: `Document with ID ${documentId} does not exist.`
                })
            } else {
                res.status(200).json(doc)
            }
        } else {
            res.status(400).json({
                message: "documentId must be provided."
            })
        }
    }

    async createDocument(req: Request, res: Response, next: NextFunction) {
        const reqBody = req.body
        const documentData: DocumentData = {
            title: reqBody.title,
            content: reqBody.content,
            createdByUserId: reqBody.createdByUserId
        }
        try {
            const doc = await services.documentService.createDocument(documentData)
            res.status(201).json(doc)
        } catch (error) {
            res.status(500).json({
                message: `Unable to create document.`
            })
            console.error(error)
        }
    }

    async updateDocument(req: Request, res: Response, next: NextFunction) {
        const { documentId } = req.params
        const reqBody = req.body
        const documentData: DocumentData = {
            title: reqBody.title,
            content: reqBody.content,
            createdByUserId: reqBody.createdByUserId
        }

        if (documentId) {
            try {
                const doc = await services.documentService.updateDocument(documentId, documentData)
                res.status(200).json(doc)
            } catch (error) {
                res.status(304).json({
                    message: `Unable to update document.`
                })
                console.error(error)
            }
            
        } else {
            res.status(400).json({
                message: "documentId must be provided."
            })
        }
    }

    async deleteDocument(req: Request, res: Response, next: NextFunction) {
        const { documentId } = req.params
        if (documentId) {
            await services.documentService.deleteDocument(documentId)
            res.status(200).json({
                message: `Document with ID ${documentId} is deleted successfully.`
            })
        } else {
            res.status(400).json({
                message: "documentId must be provided."
            })
        }
    }

    async getDocumentOwners(req: Request, res: Response, next: NextFunction) {
        try {
            const { documentId } = req.params
            if (documentId) {
                const users = await services.userService.getUsersOwningDocument(documentId)
                res.status(200).json(users)
            } else {
                res.status(400).json({
                    message: "documentId must be provided."
                })
            }
        } catch (error) {
            res.status(500).json({
                message: "Unable to get document's owners. Internal server error."
            })
            console.error(error)
        }
        
    }
}
