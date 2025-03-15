import { DocumentService } from './DocumentService';
import { ImageService } from './ImageService';
import { TipTapDocumentService } from './TipTapDocumentService';
import { UserService } from './UserService';

const userService = new UserService();
const documentService = new DocumentService();
const tiptapDocumentService = new TipTapDocumentService();
const imageService = new ImageService();

export const services = {
    userService,
    documentService,
    tiptapDocumentService,
    imageService
};
