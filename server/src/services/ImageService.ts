import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3ServiceException } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config';
import { BadRequestError, UnauthorizedError } from '../helpers/ErrorHelpers';
import { s3Client } from '../s3';
import { DocumentData } from '../types/DocumentTypes';
import { services } from './services';

export class ImageService {
    constructor() {}

    async getUploadURLS(imageNames: string[]) {
        const uniqueImageNames: string[] = [];
        try {
            const signedUrls = await Promise.all(
                imageNames.map(async (imageName) => {
                    const extension = imageName.substring(imageName.lastIndexOf('.'));
                    const baseName = imageName.substring(0, imageName.lastIndexOf('.'));
                    const uniqueImageName = `${baseName}-${uuidv4()}${extension}`;
                    uniqueImageNames.push(uniqueImageName);
                    const params: PutObjectCommandInput = {
                        Bucket: config.awsUser.s3BucketName,
                        Key: uniqueImageName,
                        ContentType: `image/*`
                    };

                    const command = new PutObjectCommand(params);
                    return getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 7 });
                })
            );
            return {
                uniqueImageNames,
                signedUploadUrls: signedUrls
            };
        } catch (error: any) {
            throw new BadRequestError(error.message);
        }
    }

    checkDownloadURLsToBeGeneratedAreFromYourDocument(document: DocumentData, imageNamesWithGuid: (string | null)[]) {
        for (let imageNameWithGuid of imageNamesWithGuid) {
            if (!imageNameWithGuid) continue;
            if (!document.images.includes(imageNameWithGuid)) return false;
        }
        return true;
    }

    /**
     * Assumes that we have already checked and confirmed that we have the proper permissions to generate
     * download urls.
     * @param imageNamesWithGuid
     * @returns
     */
    async generateDownloadURLs(imageNamesWithGuid: (string | null)[]) {
        try {
            const signedUrls = await Promise.all(
                imageNamesWithGuid.map(async (imageNameWithGuid) => {
                    if (!imageNameWithGuid) return null;
                    const params = {
                        Bucket: config.awsUser.s3BucketName,
                        Key: imageNameWithGuid
                    };

                    const command = new GetObjectCommand(params);
                    return getSignedUrl(s3Client, command, { expiresIn: 86400 });
                })
            );
            return {
                uniqueImageNames: imageNamesWithGuid,
                signedDownloadUrls: signedUrls
            };
        } catch (error: any) {
            throw new BadRequestError(error.message);
        }
    }
    async getDownloadURLs(userId: string, imageNamesWithGuid: (string | null)[], documentId: string) {
        const document = await services.documentService.getDocument(userId, documentId);
        if (document && this.checkDownloadURLsToBeGeneratedAreFromYourDocument(document, imageNamesWithGuid)) {
            return await this.generateDownloadURLs(imageNamesWithGuid);
        } else {
            throw new UnauthorizedError();
        }
    }

    async deleteImage(userId: string, documentId: string, imageNameWithGuidToDelete: string) {
        await services.documentService.deleteImage(userId, documentId, imageNameWithGuidToDelete);
        await this.deleteImageFromAWS(imageNameWithGuidToDelete);
    }

    async deleteImageFromAWS(imageNameWithGuid: string) {
        const bucketName = config.awsUser.s3BucketName;
        try {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: imageNameWithGuid
                })
            );
            console.log(`The object "${imageNameWithGuid}" from bucket "${bucketName}" was deleted, or it didn't exist.`);
        } catch (caught) {
            if (caught instanceof S3ServiceException && caught.name === 'NoSuchBucket') {
                console.error(`Error from S3 while deleting object from ${bucketName}. The bucket doesn't exist.`);
            } else if (caught instanceof S3ServiceException) {
                console.error(`Error from S3 while deleting object from ${bucketName}.  ${caught.name}: ${caught.message}`);
            }
            throw caught;
        }
    }

    async addImages(userId: string, documentId: string, newImageNamesWithGuid: string[]) {
        await services.documentService.addImages(userId, documentId, newImageNamesWithGuid);
        return documentId;
    }
}
