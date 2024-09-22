import axios from 'axios';
import { config } from '../config/config';
import { DocumentCreationAttributes } from "../types/DocumentTypes";
export const getAllDocuments = async (userId: string, collabToken: string, startDate: string | null, endDate: string | null) => {
    let documentUrl = `${config.baseUrl}/api/documents?userId=${userId}`

    if(startDate != null && endDate != null) documentUrl += `&startDate=${startDate}&endDate=${endDate}`
    const { data } = await axios.get(documentUrl, {
        headers: {
            'Authorization': `Bearer ${collabToken}`
        }
    });
    return data;
};

export const createDocument = async( collabToken: string, documentData: DocumentCreationAttributes) => {
    await axios.post(`${config.baseUrl}/api/documents`, documentData, {
        headers: {
            'Authorization': `Bearer ${collabToken}`
        }
    })
}
