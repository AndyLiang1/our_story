import axios from 'axios';
import { config } from '../config/config';

export const getGeneratedUploadImageSignedUrls = async (
    collabToken: string,
    imageNames: string[]
) => {
    const { data } = await axios.post(
        `${config.baseUrl}/api/images/uploadUrls`,
        {
            imageNames: imageNames
        },
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
    const signedUrlsAndImageNamesWithGuid = data;
    return signedUrlsAndImageNamesWithGuid;
};

export const getGeneratedDownloadImageSignedUrls = async (
    collabToken: string,
    imageNamesWithGuid: string[]
) => {
    const { data } = await axios.post(
        `${config.baseUrl}/api/images/downloadUrls`,
        {
            imageNames: imageNamesWithGuid
        },
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
    const signedUrlsAndImageNamesWithGuid = data;
    return signedUrlsAndImageNamesWithGuid;
};

export const addDocumentImages = async (
    collabToken: string,
    newImageNamesWithGuid: string[],
    documentId: string
) => {
    await axios.post(
        `${config.baseUrl}/api/images/${documentId}`,
        { newImageNamesWithGuid },
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
};

export const deleteDocumentImages = async (
    collabToken: string,
    imageNameWithGuidToDelete: string,
    documentId: string
) => {
    await axios.delete(
        `${config.baseUrl}/api/images/${documentId}?imageNameWithGuidToDelete=${imageNameWithGuidToDelete}`,
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
};
