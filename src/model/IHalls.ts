export type HallSeatType = 'standart' | 'vip' | 'taken' | 'disabled';
export type IHallConfig = HallSeatType[][];

export interface IHalls {
  id: number;
  hall_name: string;
  hall_rows: number;
  hall_places: number;
  hall_config: IHallConfig;
  hall_price_standart: number;
  hall_price_vip: number;
  hall_open: 0 | 1;
}

