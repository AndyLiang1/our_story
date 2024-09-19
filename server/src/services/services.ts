import { DocumentService } from './DocumentService';
import { UserService } from './UserService';
import {TipTapDocumentService} from "./TipTapDocumentService"

const userService = new UserService();
const documentService = new DocumentService();
const tiptapDocumentService = new TipTapDocumentService();

export const services = {
    userService,
    documentService,
    tiptapDocumentService
};
