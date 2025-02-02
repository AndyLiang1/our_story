import axios from 'axios';
import { config } from '../config/config';
import {
    DocumentCreationAttributes,
    DocumentData,
    DocumentsWithFlags
} from '../types/DocumentTypes';
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
            eventDate: new Date(document.eventDate)
        };
    });
    return documents;
};

export const getDocumentsInMonth = async (
    dateWhoseMonthToSearchFor: Date,
    userId: string,
    collabToken: string
) => {
    const { firstDateOfMonth, lastDateOfMonth } =
        getFirstAndLastDayOfMonth(dateWhoseMonthToSearchFor);
    const url = `${config.baseUrl}/api/documents?userId=${userId}&startDate=${firstDateOfMonth}&endDate=${lastDateOfMonth}`;
    const { data } = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${collabToken}`
        }
    });
    const documents: DocumentData[] = data.map((document: DocumentData) => {
        return {
            ...document,
            eventDate: new Date(document.eventDate)
        };
    });
    return documents;
};

const getFirstAndLastDayOfMonth = (currentDate: Date) => {
    const firstDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return { firstDateOfMonth, lastDateOfMonth };
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
        { ...documentData, eventDate: new Date(documentData.eventDate) },
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
