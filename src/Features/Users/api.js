import axios from "axios";
import { API_ENDOPOINTS } from "../../lib/constants";

export const createUser = async (reqBody) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.post(`${API_ENDOPOINTS.USERS}/create`, reqBody,{
      headers: {
        "Content-type" : "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get data");
  }
};

export const getallUser = async () => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(`${API_ENDOPOINTS.USERS}/view`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get data");
  }
};

export const getUserProfile = async (id) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(`${API_ENDOPOINTS.USERS}/view/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get data");
  }
};

export const singleProfile = async(id,reqBody)=>{
  const token = localStorage.getItem("adminToken");
  try{
    const response = await axios.patch(`${API_ENDOPOINTS.USERS}/status/${id}`,reqBody,{
  headers: {
        "Content-type" : "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data;
  }catch(error){
    console.error("Failed to update profile");
    throw error;
  }
}








