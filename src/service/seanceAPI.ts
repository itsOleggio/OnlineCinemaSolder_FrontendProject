import axios, { AxiosError } from "axios";

const API = import.meta.env.VITE_SERVER_API_URL;

export const addSeance = async (
  seanceHallid: number,
  seanceFilmid: number,
  seanceTime: string,
) => {
  try {
    const response = await axios.post(`${API}/seance`, {
      seanceHallid: seanceHallid,
      seanceFilmid: seanceFilmid,
      seanceTime: seanceTime,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    const err = e as AxiosError<{ error: string }>;
    return {
      success: false,
      data: null,
      error: err.response?.data?.error || "Неизвестная ошибка",
    };
  }
};

export const deleteSeance = async (seanceId: number) => {
  try {
    const response = await axios.delete(`${API}/seance/${seanceId}`);
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
