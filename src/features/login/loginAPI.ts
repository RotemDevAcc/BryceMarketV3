import axios from 'axios';
import { TargetServer } from '../settings/settings';
import { Message } from '../../Message';
export async function logtoServer(details: { userName: string; password: string; }) {
    const MY_SERVER = `${TargetServer}login/`; // Updated protocol to 'http' or 'https'
    
    const data = {
        "username": details.userName,
        "password": details.password
    }
    return axios.post(MY_SERVER, JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.detail,"error")
        throw error;
    });
}