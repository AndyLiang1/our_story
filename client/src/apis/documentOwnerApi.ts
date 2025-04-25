import axios from 'axios';
import Swal from 'sweetalert2';
import { config } from '../config/config';

export const addDocumentOwner = async (
    collabToken: string,
    documentId: string,
    partnerEmail: string
) => {
    try {
        const response = await axios.post(
            `${config.baseUrl}/api/documentOwners/${documentId}`,
            { partnerEmail }, // only allow one partner for now
            {
                headers: {
                    Authorization: `Bearer ${collabToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            console.log(error.response?.status);
            await Swal.fire({
                title: 'Error',
                text:
                    status === 409
                        ? 'You have already shared this document with this user'
                        : 'Something went wrong',
                icon: 'error',
                confirmButtonText: 'Login'
            });
        }
    }
};
