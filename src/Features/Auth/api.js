import axios from "axios";
import { API_ENDOPOINTS } from "../../lib/constants";

export const AdminLogin = async(data)=>{
    try{
        const response = await axios.post(`${API_ENDOPOINTS.LOGIN}`,data,{

        })
        return response.data;
    }catch(error){
        console.error("Failed to login admin");
        throw error
    }
}
