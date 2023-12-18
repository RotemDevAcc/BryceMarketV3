import axios from "axios"
import { TargetServer } from "../settings/settings"



export function getAllProducts(token:string) {
    return axios.get(`${TargetServer}productslist/`,{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
}