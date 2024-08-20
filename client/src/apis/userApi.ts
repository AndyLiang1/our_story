import axios from 'axios'
import {config} from "../config/config"
import { LoginType } from '../types/UserTypes'
export const login = async (formData: LoginType) => {
    try {
        const {data} = await axios.get(`${config.baseUrl}/users/login`)
        return data 
    } catch (err: any) {
        return err.message
    }
}