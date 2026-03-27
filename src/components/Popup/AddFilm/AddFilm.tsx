import style from "./../Popup.module.css";
import closeIcon from "../../../assets/icons/close.png";
import { useRef, useState } from "react";
import type { IFilms } from "../../../model/IFilm";
import { addFilmApi } from "../../../service/filmAPI";

interface AddFilmProps {
  readonly onClose: () => void;
  readonly onSuccess: () => Promise<void>;
}

export function AddFilm({ onClose, onSuccess }: AddFilmProps) {
  const [film, setFilm] = useState<IFilms>({
    id: 0,
    film_name: "",
    film_duration: 0,
    film_description: "",
    film_origin: "",
    film_poster: "",
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setError("");
    if (!film.film_name) {
      setError("Введите имя фильма");
      return;
    }
    if (!film.film_duration) {
      setError("Введите продолжительность фильма");
      return;
    }
    if (Number(film.film_duration) <= 0) {
      setError("Длительность фильма должна быть больше 0");
      return;
    }
    if (!film.film_description) {
      setError("Введите описание фильма");
      return;
    }
    if (!film.film_origin) {
      setError("Введите страну фильма");
      return;
    }
    if (!posterFile) {
      setError("Добавьте постер фильма");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("filmName", film.film_name);
      formData.append("filmDuration", String(film.film_duration));
      formData.append("filmDescription", film.film_description);
      formData.append("filmOrigin", film.film_origin);
      if (posterFile) {
        formData.append("filePoster", posterFile);
      }

      const data = await addFilmApi(formData);
      if (data.success) {
        onSuccess();
        onClose();
      } else setError(data.error || "Ошибка");
    } catch (e) {
      setError("Ошибка при добавлении фильма: " + e);
    }
  };

  return (
    <main className={style.popupContainer}>
      <article>
        <div className={style.popupTitle}>
          <h3 className={style.title}>Добавление фильма</h3>
          <button className={style.btnCross} onClick={() => onClose()}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <div>
          <section>
            <form>
              <div className={style.inputPlace}>
                <label htmlFor="addFilmName">Название фильма</label>
                <input
                  id="addFilmName"
                  placeholder="Например, «Гражданин Кейн»"
                  type="text"
                  required
                  value={film.film_name}
                  onChange={(e) =>
                    setFilm({ ...film, film_name: e.target.value })
                  }
                />

                <label htmlFor="addFilmDuration">
                  Продолжительность фильма (мин.)
                </label>
                <input
                  id="addFilmDuration"
                  type="number"
                  min={0}
                  value={film.film_duration}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFilm({
                      ...film,
                      film_duration: value === "" ? "" : Number(value),
                    });
                  }}
                />
                <label htmlFor="addFilmDescription">Описание фильма</label>
                <textarea
                  id="addFilmDescription"
                  value={film.film_description}
                  onChange={(e) =>
                    setFilm({ ...film, film_description: e.target.value })
                  }
                />
                <label htmlFor="addFilmOrigin">Страна</label>
                <input
                  id="addFilmOrigin"
                  value={film.film_origin}
                  onChange={(e) =>
                    setFilm({ ...film, film_origin: e.target.value })
                  }
                />

                <input
                  type="file"
                  accept="image/png"
                  ref={fileRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPosterFile(file);
                  }}
                />
              </div>
              <span className={style.error}>{error}</span>
            </form>
            <div className={style.btnContainer}>
              <button onClick={handleSubmit}>Добавить фильм</button>
              <button
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.click();
                  }
                }}
              >
                Загрузить постер
              </button>
              <button onClick={() => onClose()}>Отмена</button>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
