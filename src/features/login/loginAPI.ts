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

export async function updateClientPicture(formData: FormData) {
    const MY_SERVER = `${TargetServer}profile/`; // Updated protocol to 'http' or 'https'
    
    const token = formData.get('token');

    return axios.put(MY_SERVER, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        console.log(response)
        return response;
    })
    .catch(error => {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.detail,"error")
        throw error;
    });
}

export async function updateClientName(formData: FormData) {
    const MY_SERVER = `${TargetServer}profile/`; // Updated protocol to 'http' or 'https'
    

    const token = formData.get('token');

    return axios.put(MY_SERVER, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        console.log(response)
        return response;
    })
    .catch(error => {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.detail,"error")
        throw error;
    });
}