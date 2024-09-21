import axios from 'axios';
import { config } from '../config/config';
import { DocumentCreationAttributes } from '../types/DocumentTypes';
export const getAllDocuments = async (userInfoAuthToken: string, userInfoTipTapToken: string, userId: string, startDate: string | null, endDate: string | null) => {
    let documentBaseUrl = `${config.baseUrl}/documents?userId=${userId}`

    if(startDate != null && endDate != null) documentBaseUrl += `&startDate=${startDate}&endDate=${endDate}`

    const { data } = await axios.get(documentBaseUrl, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('our_story_collabToken')}`
        }
    });
    return data;
};

export const createDocument = async(documentData: DocumentCreationAttributes) => {
    await axios.post(`${config.baseUrl}/documents`, documentData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('our_story_collabToken')}`
        }
    })
}
