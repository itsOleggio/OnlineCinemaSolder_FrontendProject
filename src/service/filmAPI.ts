import axios from "axios";
import type { IFilms } from "../model/IFilm";

const API = import.meta.env.VITE_SERVER_API_URL;

export const addFilmApi = async (
  formData: FormData,
): Promise<{ success: boolean; data: IFilms | null; error?: string }> => {
  try {
    const response = await axios.post(`${API}/film`, formData);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      data: null,
      error: (e as Error).message,
    };
  }
};

export const deleteFilmApi = async (film_id: number) => {
  try {
    const response = await axios.delete(`${API}/film/${film_id}`);
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
