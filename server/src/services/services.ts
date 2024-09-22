import { DocumentService } from './DocumentService';
import { TipTapDocumentService } from './TipTapDocumentService';
import { UserService } from './UserService';

const userService = new UserService();
const documentService = new DocumentService();
const tiptapDocumentService = new TipTapDocumentService();

export const services = {
    userService,
    documentService,
    tiptapDocumentService
};
