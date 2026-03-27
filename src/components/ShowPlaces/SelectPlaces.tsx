import style from "./ShowPlaces.module.css";

interface SelectPlacesProps {
  readonly onChange: (value: string) => void;
}

export function SelectPlaces({ onChange }: SelectPlacesProps) {
  return (
    <select
      className={style.selectSeats}
      onChange={(e) => onChange(e.target.value)}
      name="seatType"
    >
      <option value="default">Обычное кресло</option>
      <option value="vip">VIP кресло</option>
      <option value="disabled">Заблокировать</option>
    </select>
  );
}
