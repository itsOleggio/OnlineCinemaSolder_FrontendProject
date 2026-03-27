import style from "./../Editor.module.css";
import convertName from "../../../utils/convertHallsName";
import type { IHalls } from "../../../model/IHalls";
import { changeSaleStatus } from "../../../service/hallConfigAPI";

interface OpenSalesProps {
  halls: IHalls[];
  selectedHall: IHalls | null;
  handleSelectedHall: (id: number) => void;
  loadHalls: () => Promise<void>;
}

export function OpenSales({
  halls,
  selectedHall,
  handleSelectedHall,
  loadHalls,
}: OpenSalesProps) {
  const handleChangeStatus = async (id?: number, hallStatus?: 0 | 1) => {
    if (id === undefined || hallStatus === undefined) return;

    const newStatus: 0 | 1 = hallStatus === 0 ? 1 : 0;
    const result = await changeSaleStatus(id, newStatus);

    if (result.data.success) {
      await loadHalls();
    }
  };

  return (
    <div>
      <section className={`${style.content} ${style.last}`}>
        <div className={`${style.contentItem}`}>
          <span>Выбирите зал для открытия/закрытия продаж:</span>
          <br />
          <div>
            {halls.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`${style.configButton} ${selectedHall?.id === item.id ? style.configButtonActive : ""}`}
                onClick={() => handleSelectedHall(item.id)}
              >
                {convertName(item.hall_name)}
              </button>
            ))}
          </div>

          <div className={style.info}>
            <span>
              {selectedHall?.hall_open === 0
                ? "Все готово к открытию"
                : "Приостановить продажу билетов"}
            </span>
          </div>

          <div className={style.containerBtn}>
            <button
              className={style.mainBtn}
              type="button"
              onClick={() =>
                handleChangeStatus(selectedHall?.id, selectedHall?.hall_open)
              }
            >
              {selectedHall?.hall_open === 0
                ? "Открыть продажи"
                : "Закрыть продажи"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
