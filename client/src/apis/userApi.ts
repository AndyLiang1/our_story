import axios from 'axios'
import {config} from "../config/config"
import { getErrorMessage } from '../utils/errorUtils';

export const addUser = async (
    email: string, 
    cognitoId: string, 
    givenName: string, 
    familyName: string
) => {
    const user = await axios.post(
        `${config.baseUrl}/api/user`, 
        {
            cognitoId,
            email,
            givenName,
            familyName
        }
    );
    console.log(`Added user successfully. ${JSON.stringify(user)}`)
    return user
}

export const getUserByEmail = async (email: string) => {
    try {
        const user = await axios.get(
            `${config.baseUrl}/api/user/email/${encodeURIComponent(email)}`,
        )
        return user
    } catch (err) {
        console.error(`Unable to retrieve user with email ${email}: ${getErrorMessage(err)}`)
    }

}
