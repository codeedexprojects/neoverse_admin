import axios from "axios";
import { API_ENDOPOINTS } from "../../lib/constants";

export const dashboard = async()=>{
    const token = localStorage.getItem("adminToken")
    try{
        const response = await axios.get(`${API_ENDOPOINTS.DASHBOARD}`,{
            headers:{
                Authorization:`Bearer ${token}`
            },
        })
        return response.data;
    }catch(error){
        console.error("Failed to get data");
        throw error;
    }
}