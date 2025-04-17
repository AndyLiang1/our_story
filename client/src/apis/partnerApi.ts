import axios from 'axios';
import { config } from '../config/config';

export const createPartnership = async (collabToken: string, partnerEmail: string) => {
    const { data } = await axios.post(
        `${config.baseUrl}/api/partners`,
        { partnerEmail },
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
    return data;
};
