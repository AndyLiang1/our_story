import { DocumentRepo } from '../repositories/DocumentRepo';
export class DocumentService {
    repo: any;
    constructor() {
        this.repo = new DocumentRepo();
    }

    async getAllDocuments() {
        const data = this.repo.getAllDocuments();
        return data;
    }

    async getDocument() {
        const data = this.repo.getDocument();
        return data;
    }

    async createDocument() {
        const data = this.repo.createDocument();
        return data;
    }

    async updateDocument() {
        const data = this.repo.updateDocument();
        return data;
    }

    async deleteDocument() {
        const data = this.repo.deleteDocument();
        return data;
    }
}
