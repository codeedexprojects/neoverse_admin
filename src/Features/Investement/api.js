import axios from "axios";
import { API_ENDOPOINTS } from "../../lib/constants";

export const getInvestment = async () => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(`${API_ENDOPOINTS.INVESTMENT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get investments");
    throw error;
  }
};

export const updateInvestment = async (id, reqBody) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.patch(
      `${API_ENDOPOINTS.INVESTMENT}/process/${id}`,reqBody,
      {
        headers: {
            "Content-Type" : "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get investments");
    throw error;
  }
};

export const statusInvestment = async () => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(`${API_ENDOPOINTS.INVESTMENT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get investments");
    throw error;
  }
};
