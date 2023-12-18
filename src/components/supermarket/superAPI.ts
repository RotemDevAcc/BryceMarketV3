import axios from 'axios'
import { TargetServer } from '../settings/settings';
import { Message } from '../../Message';
export function fetchProducts() {
    return axios.get(`${TargetServer}productslist/`)
}

export const buyCart = async (data: { cart?: []; token: string; price?: number; })=> {
    

    try {
        const response = await axios.post(`${TargetServer}productslist/`, data, {
            headers: {
                "Authorization": `Bearer ${data.token}`,
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error:any) {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.detail, "error");
        throw error;
    }

    // const response = await fetch(MY_SERVER + "/productslist/", {
    //     method: "POST",
    //     headers: {
    //         "Authorization": `Bearer ${myToken}`,
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ "cart": cart, "price": totalPrice })
    // })
    // const result = await response.json();
    // if (result.state == "success") {
    //     Message(result.msg, "success")
    //     clearCart()
    // } else {
    //     Message(result.msg, "error")
    // }
}