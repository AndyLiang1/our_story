import express, { Request, Response, NextFunction, Router } from 'express';
import { services } from '../services/services';

class DocumentController {
    router: Router;
    constructor() {
        this.router = express.Router();
        // the this.login.bind(this) is basically saying
        // when I hit /api/users in a get request, I am going
        // to call the login function
        // https://stackoverflow.com/questions/40018472/implement-express-controller-class-with-typescript
        this.router.get('/documents/', this.getAllDocuments.bind(this));
        this.router.get('/documents/:documentId', this.getDocument.bind(this));
        this.router.post('/documents/', this.createDocument.bind(this));
        this.router.put('/documents/:documentId', this.updateDocument.bind(this));
        this.router.delete('/documents/:documentId', this.deleteDocument.bind(this));
    }

    initRoutes(apiRouter: Router) {
        apiRouter.use('/documents', this.router);
    }

    async getAllDocuments(req: Request, res: Response, next: NextFunction) {}

    async getDocument(req: Request, res: Response, next: NextFunction) {}

    async createDocument(req: Request, res: Response, next: NextFunction) {}

    async updateDocument(req: Request, res: Response, next: NextFunction) {}

    async deleteDocument(req: Request, res: Response, next: NextFunction) {}
}
