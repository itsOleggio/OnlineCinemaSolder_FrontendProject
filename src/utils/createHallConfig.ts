import type { HallSeatType } from "../model/IHalls";

export function createHallConfig(
  rows: number,
  place: number,
): HallSeatType[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: place }, () => "standart"),
  );
}

export function resizeHallConfig(
  config: HallSeatType[][],
  newRows: number,
  newPlaces: number,
): HallSeatType[][] {
  const newConfig: HallSeatType[][] = [];
  for (let r = 0; r < newRows; r++) {
    const row: HallSeatType[] = [];

    for (let p = 0; p < newPlaces; p++) {
      row.push(config?.[r]?.[p] ?? "standart");
    }
    newConfig.push(row);
  }
  return newConfig;
}
