import axios from "axios";

const API = import.meta.env.VITE_SERVER_API_URL;

export const getAllData = async () => {
  try {
    const response = await axios.get(`${API}/alldata`);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      error: e,
      data: null,
    };
  }
};

export const newHall = async (hallName: string) => {
  try {
    const response = await axios.post(`${API}/hall`, { hallName: hallName });
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      error: e,
      data: null,
    };
  }
};

export const deleteHall = async (hallId: number) => {
  try {
    const response = await axios.delete(`${API}/hall/${hallId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      error: e,
      data: null,
    };
  }
};
