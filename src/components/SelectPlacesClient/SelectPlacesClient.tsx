import { useEffect, useState } from "react";
import { getHallForClient } from "../../service/hallConfigAPI";
import style from "./SelectPlacesClient.module.css";
import type { ITicket } from "../../model/ITicket";

interface SelectPlacesClientProp {
  readonly seanceId: number | null;
  readonly date: string;
  readonly selectedSeats: ITicket[];
  readonly setSelectedSeats: React.Dispatch<React.SetStateAction<ITicket[]>>;
  readonly defaultPrice: number;
  readonly vipPrice: number;
}

export function SelectPlacesClient({
  seanceId,
  date,
  selectedSeats,
  setSelectedSeats,
  defaultPrice,
  vipPrice,
}: SelectPlacesClientProp) {
  const [config, setConfig] = useState<string[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!seanceId) return;
      const res = await getHallForClient(seanceId, date);

      if (!res.success || !res.data) return;

      if (res.data.success) {
        setConfig(res.data.result);
      }
    };
    fetchData();
  }, [seanceId, date]);

  return (
    <div className={style.placeContainer}>
      <div className={style.screen}>
        <span>Экран</span>
      </div>
      {config.map((row, rowIndex) => (
        <div key={rowIndex} className={style.rows}>
          {row.map((seat, seatIndex) => {
            const isSelected = selectedSeats.some(
              (s) =>
                s.row === String(rowIndex) && s.place === String(seatIndex),
            );

            const backgroundColor =
              seat === "vip"
                ? "#F9953A"
                : seat === "disabled"
                  ? "inherit"
                  : seat === "taken"
                    ? "transparent"
                    : "#FFFFFF";
            const border = seat === "taken" ? "1px solid #525252" : "none";
            const seatClass =
              seat === "disabled" || seat === "taken"
                ? style.inactiveSeat
                : style.seat;

            return (
              <button
                key={seatIndex}
                className={`${seatClass} ${isSelected ? style.selected : ""}`}
                style={{ backgroundColor, border }}
                onClick={() => {
                  if (seat === "disabled" || seat === "taken") return;

                  const newSeat: ITicket = {
                    row: String(rowIndex),
                    place: String(seatIndex),
                    price: seat === "vip" ? vipPrice : defaultPrice,
                  };

                  setSelectedSeats((prev) => {
                    const exists = prev.some(
                      (s) => s.row === newSeat.row && s.place === newSeat.place,
                    );

                    if (exists) {
                      return prev.filter(
                        (s) =>
                          !(s.row === newSeat.row && s.place === newSeat.place),
                      );
                    } else {
                      return [...prev, newSeat];
                    }
                  });
                }}
              />
            );
          })}
        </div>
      ))}
      <br></br>
      <div className={style.seatInfo}>
        <div className={style.column}>
          <div className={style.placeSeats}>
            <div className={style.seat} style={{ background: "white" }}></div>{" "}
            <span> - Свободно ({defaultPrice}руб)</span>
          </div>
          <div className={style.placeSeats}>
            <div className={style.seat} style={{ background: "#F9953A" }}></div>
            <span> - Свободно VIP ({vipPrice}руб)</span>
          </div>
        </div>
        <div className={style.column}>
          <div className={style.placeSeats}>
            <div
              className={style.seat}
              style={{ background: "inherit", border: "1px solid #525252" }}
            ></div>
            <span> - Занято</span>
          </div>
          <div className={style.placeSeats}>
            <div className={style.seat} style={{ background: "#25C4CE" }}></div>
            <span> - Выбрано</span>
          </div>
        </div>
      </div>
      <div className={style.SelectedPlace}>
        {selectedSeats.length > 0 && <h3>Выбранные места</h3>}
        <section>
          {selectedSeats.map((seat, index) => (
            <li key={index}>
              Ряд: {Number(seat.row) + 1}, Место: {Number(seat.place) + 1}
            </li>
          ))}
        </section>
      </div>
    </div>
  );
}
