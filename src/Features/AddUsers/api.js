import axios from "axios";
import { API_ENDOPOINTS } from "../../lib/constants";

export const getAllBot = async () => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(`${API_ENDOPOINTS.BOT}/view`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get the response");
    throw error;
  }
};
export const createBot = async (botData) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.post(`${API_ENDOPOINTS.BOT}/create`, botData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get the response");
    throw error;
  }
};

export const updateBot = async (id, botData) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.patch(`${API_ENDOPOINTS.BOT}/update/${id}`,botData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update the response");
    throw error;
  }
};

export const deleteBot = async (id) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.delete(`${API_ENDOPOINTS.BOT}/delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete the response");
    throw error;
  }
};
export const getByidBot = async (id) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(`${API_ENDOPOINTS.BOT}/view/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete the response");
    throw error;
  }
};
