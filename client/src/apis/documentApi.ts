import axios from 'axios';
import { promptLoginSwal } from '../components/Alerts/PromptLogin';
import { config } from '../config/config';
import {
    DocumentCreationAttributes,
    DocumentData,
    DocumentsWithFlags
} from '../types/DocumentTypes';
export const getDocumentsAllStories = async (collabToken: string, page: number) => {
    const documentUrl = `${config.baseUrl}/api/documents?page=${page}`;
    try {
        const { data } = await axios.get(documentUrl, {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        });
        data.documents = data.documents.map((document: DocumentData) => {
            return {
                ...document,
                eventDate: new Date(document.eventDate)
            };
        });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 403) await promptLoginSwal();
        }
    }
};

export const getDocument = async (documentId: string, collabToken: string) => {
    const url = `${config.baseUrl}/api/documents/${documentId}`;
    const { data } = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${collabToken}`
        }
    });
    const document: DocumentData = {
        ...data,
        eventDate: new Date(data.eventDate)
    };

    return document;
};

export const getDocumentsInMonth = async (dateWhoseMonthToSearchFor: Date, collabToken: string) => {
    const { firstDateOfMonth, lastDateOfMonth } =
        getFirstAndLastDayOfMonth(dateWhoseMonthToSearchFor);
    const url = `${config.baseUrl}/api/documents?startDate=${firstDateOfMonth}&endDate=${lastDateOfMonth}`;
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
    collabToken: string,
    eventDate: Date,
    documentId: string | null
) => {
    const documentUrl = `${config.baseUrl}/api/documents?neighbouringDocs=true&eventDate=${eventDate}&documentId=${documentId}`;
    try {
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
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 403) await promptLoginSwal();
        }
    }
};

export const createDocument = async (
    collabToken: string,
    documentData: DocumentCreationAttributes
) => {
    const { data } = await axios.post(
        `${config.baseUrl}/api/documents`,
        { documentData: { ...documentData, eventDate: new Date(documentData.eventDate) } },
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
    return data;
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

export const editDocumentHasUpdatedInTipTapFlag = async (
    collabToken: string,
    documentId: string
) => {
    await axios.put(
        `${config.baseUrl}/api/documents/${documentId}`,
        { hasUpdatedInTipTap: true },
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
};
export const deleteDocument = async (collabToken: string, documentId: string) => {
    await axios.delete(`${config.baseUrl}/api/documents/${documentId}`, {
        headers: {
            Authorization: `Bearer ${collabToken}`
        }
    });
};
