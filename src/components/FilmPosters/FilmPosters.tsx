import type { IFilms } from "../../model/IFilm";
import { useEffect, useMemo, useState } from "react";
import { getAllData } from "../../service/alldataAPI";
import style from "./FilmPosters.module.css";
import type { ISession } from "../../model/ISession";
import type { IHalls } from "../../model/IHalls";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

type TimeItem = {
  time: string;
  seanceId: number;
};

type HallWithTimes = {
  hallName: string;
  hall_price_standart: number;
  hall_price_vip: number;
  times: TimeItem[];
};

export function FilmPosters({
  selectDay,
}: {
  readonly selectDay: dayjs.Dayjs;
}) {
  const navigate = useNavigate();

  const [rawData, setRawData] = useState<{
    films: IFilms[];
    halls: IHalls[];
    seances: ISession[];
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getAllData();

      if (!result.success) {
        setRawData(null);
        return;
      }

      const { films, halls, seances } = result.data.result;
      setRawData({ films, halls, seances });
    };

    loadData();
  }, []);

  const films = useMemo(() => {
    if (!rawData) return [];

    const { films, halls, seances } = rawData;

    const hallsMap = new Map<number, IHalls>();
    halls.forEach((h) => hallsMap.set(h.id, h));

    const isToday = selectDay.isSame(dayjs(), "day");

    return films.map((film) => {
      const groupedHalls = new Map<number, HallWithTimes>();

      seances
        .filter((s) => {
          if (s.seance_filmid !== film.id) return false;

          if (!isToday) return true;

          const seanceDateTime = dayjs(
            `${selectDay.format("YYYY-MM-DD")} ${s.seance_time}`,
            "YYYY-MM-DD HH:mm"
          );

          return seanceDateTime.isAfter(dayjs());
        })
        .forEach((seance) => {
          const hall = hallsMap.get(seance.seance_hallid);
          if (!hall || !hall.hall_open) return;

          if (!groupedHalls.has(hall.id)) {
            groupedHalls.set(hall.id, {
              hall_price_standart: hall.hall_price_standart,
              hall_price_vip: hall.hall_price_vip,
              hallName: hall.hall_name,
              times: [],
            });
          }

          groupedHalls.get(hall.id)!.times.push({
            time: seance.seance_time,
            seanceId: seance.id,
          });
        });

      groupedHalls.forEach((hall) => {
        hall.times.sort((a, b) => a.time.localeCompare(b.time));
      });

      return {
        ...film,
        halls: Array.from(groupedHalls.values()),
      };
    });
  }, [rawData, selectDay]);

  return (
    <div className={style.filmsContainer}>
      {films.map((film) => (
        <div key={film.id} className={style.filmCard}>
          <div className={style.upperFilmCardInfo}>
            <img src={film.film_poster} alt={film.film_name} />

            <div className={style.filmInfo}>
              <h3>{film.film_name}</h3>
              <span>{film.film_description}</span>
              <span>{film.film_duration} минут</span>
            </div>
          </div>

          <div className={style.lowerFilmCardInfo}>
            {film.halls.map((hall, i) => (
              <div key={i} className={style.hallSector}>
                <strong>{hall.hallName}</strong>

                <div className={style.halls}>
                  {hall.times.map((t) => (
                    <button
                      key={t.seanceId}
                      className={style.timeBtn}
                      onClick={() =>
                        navigate(`/payment/${t.seanceId}`, {
                          state: {
                            filmName: film.film_name,
                            hallName: hall.hallName,
                            time: t.time,
                            defaultPrice: hall.hall_price_standart,
                            vipPrice: hall.hall_price_vip,
                            selectDay: dayjs(selectDay).format("YYYY-MM-DD"),
                          },
                        })
                      }
                    >
                      {t.time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}