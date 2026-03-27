export interface ITicket {
  row: string;
  place: string;
  coast?: "vip" | "standard";
  price: number; 
  isVip?: boolean;
}