import axios from "axios";
import { API_ENDOPOINTS } from "../../lib/constants";

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken'); 
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


export const getAllProfiles = async()=>{
    try{
        const response = await axios.get(`${API_ENDOPOINTS.GETPROFILE}`,getAuthHeader(),{

        })
        return response.data;
    }catch(error){
        console.error("Faield to get profiles");
        throw error;
    }
}