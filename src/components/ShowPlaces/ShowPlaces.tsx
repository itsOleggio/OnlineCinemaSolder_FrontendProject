import style from "./ShowPlaces.module.css";
import styleSeats from "./../Editor/Editor.module.css";
import type { IHalls } from "../../model/IHalls";
import { useState } from "react";
import { SelectPlaces } from "./SelectPlaces";

export function ShowPlaces({
  selectedHall,
  onChangeSeat,
}: Readonly<{
  selectedHall?: IHalls;
  onChangeSeat: (row: number, seat: number, value: string) => void;
}>) {
  const hallConfig = selectedHall?.hall_config;
  const [activeSeat, setActiveSeat] = useState<string | null>(null);

  return (
    <div className={style.ShowPlacesContainer}>
      <h3 className={style.screen}>ЭКРАН</h3>
      <div className={style.seatsContainer}>
        {hallConfig?.map((row, rowIndex) => (
          <div className={` ${style.row}`} key={rowIndex}>
            {row.map((seat, seatIndex) => {
              const isActive = activeSeat === `${rowIndex}-${seatIndex}`;

              return (
                <div key={seatIndex} className={style.seatWrapper}>
                  <button
                    className={`
                      ${styleSeats.defaultSeat} 
                      ${styleSeats[seat + "Seat"]}
                      ${activeSeat === `${rowIndex}-${seatIndex}` ? styleSeats.selectedSeat : ""}
                      `}
                    onClick={() => {
                      const id = `${rowIndex}-${seatIndex}`;
                      setActiveSeat((prev) => (prev === id ? null : id));
                    }}
                  ></button>
                  {isActive && (
                    <SelectPlaces
                      onChange={(value: string) => {
                        onChangeSeat(rowIndex, seatIndex, value);
                        setActiveSeat(null);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
