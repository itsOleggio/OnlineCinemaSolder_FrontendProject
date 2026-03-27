import { NavLink } from "react-router-dom";
import { Calendar } from "../../components/Calendar/Calendar";
import { FilmPosters } from "../../components/FilmPosters/FilmPosters";
import { Header } from "../../components/Header/Header";
import style from "./ClientPage.module.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export function ClientPage() {
  useEffect(() => {
    document.title = "Идем в кино | Купить билеты в кино";
  });
  const today = dayjs();
  const [selectDay, setSelectDay] = useState(today);

  return (
    <div className={style.backgroundImage}>
      <main>
        <div className={style.headerContainer}>
          <Header headerTitle="" />
          <NavLink to="/admin">
            <button>Войти</button>
          </NavLink>
        </div>
        <Calendar
          selectDay={selectDay}
          setSelectDay={setSelectDay}
          today={today}
        />

        <FilmPosters selectDay={selectDay}/>
      </main>
    </div>
  );
}
