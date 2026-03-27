import axios from "axios";
import type { ITicket } from "../model/ITicket";

const API = import.meta.env.VITE_SERVER_API_URL;

export const buyTicket = async (
  seanceId: number,
  ticketDate: string,
  tickets: ITicket[],
) => {
  const formattedTickets = tickets.map((t) => ({
    row: Number(t.row) + 1,
    place: Number(t.place) + 1,
    coast: Number(t.price),
  }));

  try {
    const response = await axios.post(`${API}/ticket`, {
      seanceId,
      ticketDate,
      tickets: JSON.stringify(formattedTickets),
    });

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
