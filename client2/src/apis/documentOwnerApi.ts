import axios from "axios";
import { config } from "../config/config";

export const addDocumentOwner = async (
    collabToken: string,
    documentId: string,
    partnerEmail: string
) => {
    const { data } = await axios.post(
        `${config.baseUrl}/api/documentOwners/${documentId}`,
        { partnerEmail }, // only allow one partner for now
        {
            headers: {
                Authorization: `Bearer ${collabToken}`
            }
        }
    );
    return data;
};

