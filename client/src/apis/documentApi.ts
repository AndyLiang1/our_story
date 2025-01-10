import axios from 'axios';
import moment from 'moment';
import { config } from '../config/config';
import { DocumentCreationAttributes, DocumentData, DocumentsWithFlags } from '../types/DocumentTypes';
export const getAllDocuments = async (
    userId: string,
    collabToken: string,
    startDate: Date | null,
    endDate: Date | null
) => {
    let documentUrl = `${config.baseUrl}/api/documents?userId=${userId}`;

    if (startDate != null && endDate != null)
        documentUrl += `&startDate=${startDate}&endDate=${endDate}`;
    const { data } = await axios.get(documentUrl, {
        headers: {
            Authorization: `Bearer ${collabToken}`
        }
    });
    const documents: DocumentData[] = data.map((document: DocumentData) => {
        return {
            ...document,
            eventDate: moment.utc(document.eventDate).local().format('YYYY-MM-DD')
        };
    });
    console.log('Returning documents: ', documents);
    return documents;
};

export const getNeighbouringDocuments = async (
    userId: string,
    collabToken: string,
    eventDate: Date,
    documentId: string | null
) => {
    let documentUrl = `${config.baseUrl}/api/documents?neighbouringDocs=true&userId=${userId}&eventDate=${eventDate}&documentId=${documentId}`;
    const { data } = await axios.get(documentUrl, {
        headers: {
            Authorization: `Bearer ${collabToken}`
        }
    });
    const responseDataWithDate: DocumentsWithFlags = {
        ...data,
        documents: data.documents.map((doc: DocumentData) => ({
            ...doc,
            eventDate: new Date(doc.eventDate)
        }))
    };
    return responseDataWithDate;
};

export const createDocument = async (
    collabToken: string,
    documentData: DocumentCreationAttributes
) => {
    await axios.post(
        `${config.baseUrl}/api/documents`,
        { ...documentData, eventDate: moment.utc(documentData.eventDate).toDate() },
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
};

export const editDocumentTitle = async (collabToken: string, title: string, documentId: string) => {
    await axios.put(
        `${config.baseUrl}/api/documents/${documentId}`,
        { title },
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
};

export const editDocumentImages = async (
    collabToken: string,
    imageNames: string[],
    documentId: string
) => {
    await axios.put(
        `${config.baseUrl}/api/documents/${documentId}`,
        { images: imageNames },
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
};
