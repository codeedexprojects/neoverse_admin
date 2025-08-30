import axios from "axios";
import { API_ENDOPOINTS } from "../../lib/constants";

const getAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const adminTree = async () => {
  try {
    const response = await axios.get(
      `${API_ENDOPOINTS.ADMIN_TREE}`,
      getAuthHeader(),
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get the tree");
  }
};


export const adminUserTree = async (id) => {
  try {
    const response = await axios.get(
      `${API_ENDOPOINTS.USERS}/tree/${id}`,
      getAuthHeader(),
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get the tree");
  }
};
