import axios from "axios";
import { API_ENDOPOINTS } from "../../lib/constants";


export const UserLogins = async(data)=>{
    try{
        const response = await axios.post(`${API_ENDOPOINTS.USERLOGIN}/login`,data,{

        })
        return response.data;
    }catch(error){
        console.error("Failed to login admin");
        throw error
    }
}