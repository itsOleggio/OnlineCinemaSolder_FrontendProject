import { useState } from "react";

import style from "../Popup.module.css";
import closeIcon from "../../../assets/icons/close.png";

import type { IHalls } from "../../../model/IHalls";
import type { IFilms } from "../../../model/IFilm";
import type { ISession } from "../../../model/ISession";

import { addSeance } from "../../../service/seanceAPI";

interface AddSessionProps {
  readonly halls: IHalls[];
  readonly films: IFilms[];
  readonly selectedHallId: number | null;
  readonly selectedFilmId: number | null;
  readonly onClose: () => void;
}

export function AddSession({
  halls,
  films,
  selectedHallId,
  selectedFilmId,
  onClose,
}: AddSessionProps) {
  const [session, setSession] = useState<ISession>({
    id: 0,
    seance_hallid: selectedHallId || 0,
    seance_filmid: selectedFilmId || 0,
    seance_time: "00:00",
  });
  const [error, setError] = useState<string>("");
  const [isFirstClick, setIsFirstClick] = useState(true);

  const handleSeancesSave = async () => {
    const result = await addSeance(
      session.seance_hallid,
      session.seance_filmid,
      session.seance_time,
    );
    if (!result.data.success) {
      setError(result.data.error);
    } else {
      onClose();
    }
  };

  return (
    <main className={style.popupContainer}>
      <article>
        <div className={style.popupTitle}>
          <h3 className={style.title}>Добавление сеанса</h3>
          <button className={style.btnCross} onClick={() => onClose()}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <div>
          <section>
            <form>
              <div className={style.inputPlace}>
                <label htmlFor="addHall">Название зала</label>
                <select
                  id="addHall"
                  value={selectedHallId ?? ""}
                  onChange={(e) =>
                    setSession({
                      ...session,
                      seance_hallid: Number(e.target.value),
                    })
                  }
                >
                  <option value="" disabled>
                    Выберите зал
                  </option>

                  {halls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.hall_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="addFilm">Название фильма</label>
                <select
                  id="addFilm"
                  value={selectedFilmId || ""}
                  onChange={(e) =>
                    setSession({
                      ...session,
                      seance_filmid: Number(e.target.value),
                    })
                  }
                >
                  <option value="" disabled>
                    Выберите фильм
                  </option>

                  {films.map((film) => (
                    <option key={film.id} value={film.id}>
                      {film.film_name}
                    </option>
                  ))}
                </select>

                <label htmlFor="addFilmTime">Начало сеанса (мин.)</label>
                <input
                  className={style.timer}
                  id="addFilmTime"
                  maxLength={5}
                  type="text"
                  placeholder={session.seance_time}
                  value={session.seance_time ?? ""}
                  onWheel={(e) => e.currentTarget.blur()}
                  onClick={() => {
                    if (isFirstClick) {
                      setSession({ ...session, seance_time: "" });
                      setIsFirstClick(false);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);

                    let formatted = value;

                    if (value.length >= 3) {
                      formatted = value.slice(0, 2) + ":" + value.slice(2);
                    }

                    setSession({
                      ...session,
                      seance_time: formatted,
                    });

                    const hours = Number(value.slice(0, 2));
                    const minutes = Number(value.slice(2, 4));

                    if (value.length === 4 && (hours > 23 || minutes > 59)) {
                      setError("Некорректное время");
                    } else {
                      setError("");
                    }
                  }}
                />
              </div>
              <span className={style.error}>{error}</span>
            </form>
            <div className={style.btnContainer}>
              <button onClick={handleSeancesSave}>Добавить фильм</button>
              <button onClick={() => onClose()}>Отменить</button>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
