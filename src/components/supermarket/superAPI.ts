import axios from 'axios'
import { TargetServer } from '../settings/settings';
import { Message } from '../../Message';
import { SProductDetails } from './superSlice';
export function fetchProducts() {
    return axios.get(`${TargetServer}productslist/`)
}

export const buyCart = async (details: { cart?: SProductDetails[]; price?: number; token: string; })=> {
    

    try {
        const response = await axios.post(`${TargetServer}productslist/`, details, {
            headers: {
                "Authorization": `Bearer ${details.token}`,
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error:any) {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.detail, "error");
        throw error;
    }
}