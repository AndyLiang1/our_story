import { DocumentOwnerService } from './DocumentOwnerService';
import { DocumentService } from './DocumentService';
import { ImageService } from './ImageService';
import { PartnerService } from './PartnerService';
import { TipTapDocumentService } from './TipTapDocumentService';
import { UserService } from './UserService';

const userService = new UserService();
const documentService = new DocumentService();
const tiptapDocumentService = new TipTapDocumentService();
const imageService = new ImageService();
const partnerService = new PartnerService();
const documentOwnerService = new DocumentOwnerService()

export const services = {
    userService,
    documentService,
    tiptapDocumentService,
    imageService,
    partnerService,
    documentOwnerService
};
