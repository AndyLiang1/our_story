import axios from 'axios'
import {config} from "../config/config"
export const getAllDocuments = async (userInfoAuthToken: string, userInfoTipTapToken: string) => {
    const {data} = await axios.get(`${config.baseUrl}/documents`)
    return data 
}

