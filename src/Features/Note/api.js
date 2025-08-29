import axios from "axios";
import { API_ENDOPOINTS } from "../../lib/constants";

export const getNote = async () => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(`${API_ENDOPOINTS.NOTE}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("failed to get the notes");
    throw error;
  }
};
export const createNote = async (reqBody) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.post(`${API_ENDOPOINTS.NOTE}/create`,reqBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("failed to get the notes");
    throw error;
  }
};

export const updateNote = async (id, reqBody) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.patch(`${API_ENDOPOINTS.NOTE}/${id}`, reqBody,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("failed to get the notes");
    throw error;
  }
};

export const deleteNote = async (id) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.delete(`${API_ENDOPOINTS.NOTE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("failed to get the notes");
    throw error;
  }
};
