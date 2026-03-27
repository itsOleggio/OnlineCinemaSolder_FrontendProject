import axios from "axios";
import type { IHallConfig } from "../model/IHalls";

const API = import.meta.env.VITE_SERVER_API_URL;

export const postHallConfig = async (
  hallId: number,
  rowCount: number,
  placeCount: number,
  config: IHallConfig,
) => {
  try {
    const response = await axios.post(`${API}/hall/${hallId}`, {
      rowCount: rowCount,
      placeCount: placeCount,
      config: JSON.stringify(config),
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

export const postHallPriceChange = async (
  hallId: number,
  priceStandart: number,
  priceVip: number,
) => {
  try {
    const response = await axios.post(`${API}/price/${hallId}`, {
      priceStandart: priceStandart,
      priceVip: priceVip,
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

export const changeSaleStatus = async (
  hallId: number,
  hallOpenParam: 0 | 1,
) => {
  try {
    const response = await axios.post(`${API}/open/${hallId}`, {
      hallOpen: hallOpenParam,
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

export const getHallForClient = async (seanceId: number, data: string) => {
  try {
    const response = await axios.get(
      `${API}/hallconfig?seanceId=${seanceId}&date=${data}`,
    );
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
