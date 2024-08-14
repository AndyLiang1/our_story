import { DocumentService } from "./DocumentService";
import { UserService } from "./UserService";

const userService = new UserService()
const documentService = new DocumentService()

export const services = {
    userService,
    documentService
}