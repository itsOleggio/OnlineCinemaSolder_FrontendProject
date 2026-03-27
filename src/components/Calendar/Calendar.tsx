import dayjs from "dayjs";
import "dayjs/locale/ru";
import style from "./Calendar.module.css";
import type { Dayjs } from "dayjs";

interface IWeek {
  day: dayjs.Dayjs;
  name: string;
}

interface CalendarProps {
  selectDay: Dayjs;
  setSelectDay: React.Dispatch<React.SetStateAction<Dayjs>>;
  today: Dayjs;
}

export function Calendar({ selectDay, setSelectDay, today }: CalendarProps) {
  const week: IWeek[] = Array.from({ length: 7 }, (_, i) => {
    const day = today.add(i, "day");
    return { day, name: day.locale("ru").format("dd") };
  });

  const handleChangeDate = () => {
    setSelectDay((prev: Dayjs) => {
      const nextDay = prev.add(1, "day");
      const isInWeek = week.some((d) => d.day.isSame(nextDay, "day"));
      return isInWeek ? nextDay : today;
    });
  };

  return (
    <div className={style.container}>
      <div className={style.calendar}>
        <div className={style.header}>
          {week.map((d, index) => (
            <ul
              key={index}
              className={
                d.day.isSame(selectDay, "day")
                  ? `${style.dayBlock} ${style.active}`
                  : style.dayBlock
              }
              onClick={() => setSelectDay(d.day)}
            >
              {d.day.isSame(today, "day") && <span>Сегодня</span>}
              <div
                className={
                  d.day.isSame(today, "day")
                    ? `${style.dayToday}`
                    : `${style.dayUsual}`
                }
              >
                <span>{d.day.format("D")}</span>
                <div className={style.week}>{d.name}</div>
              </div>
            </ul>
          ))}
          <button onClick={handleChangeDate}>{">"}</button>
        </div>
      </div>
    </div>
  );
}
