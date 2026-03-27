import axios from "axios";

const API = import.meta.env.VITE_SERVER_API_URL;

export const authUser = async (login: string, pass: string) => {
  try {
    const response = await axios.post(`${API}/login`, {
      login: login,
      password: pass,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      data: null,
      error: e,
    };
  }
};
