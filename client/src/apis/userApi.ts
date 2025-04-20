import axios from 'axios';
import { config } from '../config/config';
import { COLLAB_TOKEN_KEY } from '../constant/constant';

export const addUser = async (
    email: string,
    cognitoId: string,
    givenName: string,
    familyName: string
) => {
    await axios.post(`${config.baseUrl}/api/user`, {
        cognitoId,
        email,
        givenName,
        familyName
    });
    console.log(`Added user successfully.`);
};

export const getUserByCollabToken = async () => {
    const res = await axios.get(`${config.baseUrl}/api/user`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem(COLLAB_TOKEN_KEY)}`
        }
    });
    return res.data;
};

export const getCollabToken = async (idToken: string) => {
    const res = await axios.get(`${config.baseUrl}/api/auth/getCollabToken`, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });
    return res.data.token;
};
