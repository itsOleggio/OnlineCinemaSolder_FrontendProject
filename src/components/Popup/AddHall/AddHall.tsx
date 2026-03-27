import { useState } from "react";
import style from "../Popup.module.css";
import closeIcon from "./../../../assets/icons/close.png";
import { newHall } from "../../../service/alldataAPI";

type AddHallProps = {
  onClose: () => void;
  onSuccess: () => Promise<void>;
};

export function AddHall({ onClose, onSuccess }: AddHallProps) {
  const [hall, setHall] = useState<{ hallName: string }>({
    hallName: "",
  });

  const [error, setError] = useState<string>("");

  const handleCancel = () => {
    onClose();
  };

  const handleAddHall = async () => {
    setError("");
    if (!hall.hallName.trim()) {
      setError("Установите название зала");
      return;
    }

    const result = await newHall(hall.hallName);

    if (result.success) {
      onClose();
      onSuccess();
    } else {
      console.error(result.error);
    }
  };

  return (
    <main className={style.popupContainer}>
      <article>
        <div className={style.popupTitle}>
          <h3 className={style.title}>Добавление зала</h3>
          <button className={style.btnCross} onClick={onClose}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <div>
          <section>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={style.inputPlace}>
                <label htmlFor="addHall">Название зала</label>
                <input
                  id="addHall"
                  placeholder="Например, «Зал 1»"
                  onChange={(e) =>
                    setHall({ ...hall, hallName: e.target.value })
                  }
                  required
                />
              </div>
              <span className={style.error}>{error}</span>
            </form>
            <div className={style.btnContainer}>
              <button onClick={handleAddHall}>Добавить зал</button>
              <button onClick={handleCancel}>Отмена</button>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
