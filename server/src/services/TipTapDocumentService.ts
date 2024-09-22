import axios from 'axios';
import { config } from '../config/config';
import { DocumentCreationAttributes } from '../types/DocumentTypes';

export class TipTapDocumentService {
    constructor() {}

    async createDocument(documentId: string, document: DocumentCreationAttributes) {
        await axios.post(`${config.tiptap.restApiUrl}/${documentId}?format=json`, document.documentContent, {
            headers: {
                Authorization: config.tiptap.apiSecret, // Add your token here,
                'Content-Type': 'application/json'
            }
        });
    }

    async getDocument(documentId: string) {
        const { data } = await axios.get(`${config.tiptap.restApiUrl}/${documentId}?format=json`, {
            headers: {
                Authorization: `${config.tiptap.apiSecret}`
            }
        });
        return data;
    }

    async deleteDocument(documentId: string) {
        await axios.delete(`${config.tiptap.restApiUrl}/${documentId}?format=json`, {
            headers: {
                Authorization: `${config.tiptap.apiSecret}`
            }
        });
    }
}
