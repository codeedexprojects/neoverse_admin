import axios from "axios";
import { API_ENDOPOINTS } from "../../lib/constants";

export const getinvestwithdrawal = async () => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(
      `${API_ENDOPOINTS.INVESTMENT_WITHDRAWAL}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Faield to get");
  }
};

export const updateInvestwithdrawal = async (id, status) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.patch(`${API_ENDOPOINTS.WITHDRAWAL}/${id}/process`, 
         { status },
         {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("failed to get withdrawal");
    throw error;
  }
};
