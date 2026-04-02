import { useEffect, useState } from "react";
import { deleteHall, getAllData } from "../../service/alldataAPI";
import { deleteFilmApi } from "../../service/filmAPI";
import {
  postHallConfig,
  postHallPriceChange,
} from "../../service/hallConfigAPI";
import style from "./Editor.module.css";
import type { IHalls, HallSeatType } from "../../model/IHalls";
import type { IFilms } from "../../model/IFilm";
import type { ISession } from "../../model/ISession";
import { ShowPlaces } from "../ShowPlaces/ShowPlaces";
import { resizeHallConfig } from "../../utils/createHallConfig";
import { AddFilm, AddHall } from "../Popup";
import { HeaderAdminComponent } from "./EditorComponents/HeaderAdminComponent";
import noPhoto from "./../../assets/pics/nophoto.png";
import { AddSession } from "../Popup/AddSession/AddSession";
import { DeletePopap } from "../Popup/DeletePopap/DeletePopap";
import { timeToMinutes, minutesToTime } from "../../utils/convertTime";
import { deleteSeance } from "../../service/seanceAPI";
import { useFilmColorStore } from "../../store/films.store";
import { OpenSales } from "./OpenSales/OpenSales";

export function Editor() {
  const [hallManagement, setHallManagement] = useState(true);
  const [hallConfig, setHallConfig] = useState(true);
  const [hallPrice, setHallPrice] = useState(true);
  const [hallSeansGrid, setHallSeansGrid] = useState(true);
  const [openSells, setOpenSells] = useState(true);

  const [halls, setHalls] = useState<IHalls[]>([]);
  const [selectedHall, setSelectedHall] = useState<IHalls | null>(null);
  const [films, setFilms] = useState<IFilms[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<IFilms | null>(null);
  const [seances, setSeances] = useState<ISession[]>([]);

  const [openAddHallPopap, setOpenAddHallPopap] = useState(false);
  const [openAddFilmPopap, setOpenAddFilmPopap] = useState(false);
  const [openAddSessionPopap, setOpenAddSessionPopap] = useState(false);
  const [openModalDeleted, setOpenModalDeleted] = useState(false);
  const [openDeleteSeancePopap, setOpenDeleteSeancePopap] = useState(false);

  const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null);
  const [selectedHallId, setSelectedHallId] = useState<number | null>(null);
  const [draggedSeanceId, setDraggedSeanceId] = useState<number | null>(null);
  const [selectedSeanceId, setSelectedSeanceId] = useState<number | null>(null);

  const [error, setError] = useState<string>("");
  // const [isDraggingSeance, setIsDraggingSeance] = useState(false);

  const { colors, initColor } = useFilmColorStore();

  const loadHalls = async () => {
    const result = await getAllData();

    if (!result.success) {
      setHallConfig(false);
      return;
    }

    const data = result.data;
    const filmsData = data.result.films || [];
    const hallsData = data.result.halls || [];
    const seance = data.result.seances || [];

    setHalls(hallsData);
    setFilms(filmsData);
    setSeances(seance);

    if (hallsData.length === 0) {
      setHallConfig(false);
      setSelectedHall(null);
    } else {
      setSelectedHall(hallsData[0]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadHalls();
    };
    fetchData();
  }, []);

  const handleSelectedHall = (id: number) => {
    const hall = halls.find((hall) => hall.id === id);
    if (hall !== undefined) setSelectedHall(hall);
  };

  const handleSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "rows" | "places",
  ) => {
    const value = e.target.value;

    setSelectedHall((prev) => {
      if (!prev) return prev;

      const parsedValue = value === "" ? "" : Number(value);
      const isNumber = typeof parsedValue === "number";

      let newRows = prev.hall_rows;
      let newPlaces = prev.hall_places;

      if (type === "rows" && isNumber) {
        newRows = parsedValue;
      }

      if (type === "places" && isNumber) {
        newPlaces = parsedValue;
      }

      return {
        ...prev,
        hall_rows: newRows,
        hall_places: newPlaces,
        hall_config: resizeHallConfig(prev.hall_config, newRows, newPlaces),
      };
    });
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    seatType: "standart" | "vip",
  ) => {
    const value = e.target.value;

    setSelectedHall((prev) => {
      if (!prev) return prev;

      const parsedValue = value === "" ? "" : Number(value);

      return {
        ...prev,
        [seatType === "standart" ? "hall_price_standart" : "hall_price_vip"]:
          parsedValue,
      };
    });
  };

  const saveSelectedPrice = async () => {
    setError("");

    if (!selectedHall) return;

    if (
      selectedHall?.hall_price_standart <= 0 ||
      selectedHall?.hall_price_vip <= 0
    ) {
      setError("Цены должны быть больше 0");
      return;
    }

    await postHallPriceChange(
      selectedHall.id,
      selectedHall.hall_price_standart,
      selectedHall.hall_price_vip,
    );
    loadHalls();
  };

  const handleDeleteHall = async (hallId: number) => {
    const result = await deleteHall(hallId);
    if (result.success) {
      await loadHalls();
    }
  };

  const saveSelectedHall = async () => {
    if (selectedHall) {
      await postHallConfig(
        selectedHall?.id,
        selectedHall?.hall_rows,
        selectedHall?.hall_places,
        selectedHall?.hall_config,
      );
      await loadHalls();
    }
  };

  const handleDeleteFilm = async (id: number) => {
    await deleteFilmApi(id);
    await loadHalls();
  };

  const handleDeleteSeanse = async (id: number) => {
    await deleteSeance(id);
    loadHalls();
  };

  return (
    <main>
      {openAddHallPopap ? (
        <AddHall
          onClose={() => setOpenAddHallPopap(false)}
          onSuccess={loadHalls}
        />
      ) : (
        ""
      )}

      <HeaderAdminComponent
        Title="Управление залами"
        setEditState={setHallManagement}
        hallConfig={hallConfig}
        type="first"
      />

      {hallManagement && (
        <section className={style.content}>
          <div className={style.contentItem}>
            {halls.length === 0 ? (
              <span>Нет доступных залов:</span>
            ) : (
              <>
                <span>Доступные залы:</span>
                {halls.map((item) => (
                  <div key={item.id} className={style.halls}>
                    <span className={style.hallName}>– {item.hall_name}</span>
                    <button
                      type="button"
                      className={style.basket}
                      onClick={() => {
                        setSelectedHall(item);
                        setOpenModalDeleted(true);
                      }}
                    ></button>
                  </div>
                ))}
              </>
            )}

            {openModalDeleted && selectedHall && (
              <DeletePopap
                onClose={() => setOpenModalDeleted(false)}
                actionName="Удаление зала"
                componentText="Вы точно хотите удалить зал:"
                componentElement={selectedHall.hall_name}
                onDelete={async () => {
                  setOpenModalDeleted(false);
                  handleDeleteHall(selectedHall.id);
                  setSelectedHall(halls[0]);
                }}
              />
            )}

            <button
              type="button"
              className={style.mainBtn}
              style={{ marginLeft: "8px" }}
              onClick={() => setOpenAddHallPopap(true)}
            >
              Создать зал
            </button>
          </div>
        </section>
      )}

      <HeaderAdminComponent
        Title="Конфигурация залов"
        setEditState={setHallConfig}
        hallConfig={hallConfig}
        type="usual"
      />

      {hallConfig && (
        <section className={style.content}>
          <div className={style.contentItem}>
            <div className={style.selectBlock}>
              {halls.length === 0 ? (
                <>
                  <span>Нет доступных залов для редактирования:</span>
                  <span>
                    Управление задами → <b>Создать</b>
                  </span>
                </>
              ) : (
                <>
                  <span>Выберите зал для конфигурации:</span>
                  <div>
                    {halls.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className={`${style.configButton} ${selectedHall?.id === item.id ? style.configButtonActive : ""}`}
                        onClick={() => handleSelectedHall(item.id)}
                      >
                        {item.hall_name}
                      </button>
                    ))}
                  </div>
                  <br></br>

                  <div className={style.selectBlock}>
                    <span>
                      Укажите количество рядов и максимальное количество кресел
                      в ряду:
                    </span>
                    <div className={style.inputConfig}>
                      <div className={style.inputLabel}>
                        <label htmlFor="row">Рядов, шт</label>
                        <input
                          id="row"
                          value={selectedHall?.hall_rows || ""}
                          onChange={(e) => handleSizeChange(e, "rows")}
                          type="number"
                          min={0}
                          max={20}
                          inputMode="numeric"
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </div>
                      <span className={style.labelX}>x</span>
                      <div className={style.inputLabel}>
                        <label htmlFor="places">Мест, шт</label>
                        <input
                          id="places"
                          value={selectedHall?.hall_places || ""}
                          onChange={(e) => handleSizeChange(e, "places")}
                          type="number"
                          min={0}
                          max={20}
                          inputMode="numeric"
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </div>
                    </div>
                  </div>
                  <br></br>
                  <div className={style.selectBlock}>
                    <span>
                      Теперь вы можете указать типы кресел на схеме зала:
                    </span>
                    <ul className={style.seatType}>
                      <li>
                        <div className={style.defaultSeat}></div>
                        <span> — обычные кресла</span>
                      </li>
                      <li>
                        <div className={style.vipSeat}></div>
                        <span> — VIP кресла </span>
                      </li>
                      <li>
                        <div className={style.disabledSeat}></div>
                        <span> — заблокированные (нет кресла)</span>
                      </li>
                    </ul>

                    <p style={{ color: "#848484", fontWeight: "400" }}>
                      Чтобы изменить вид кресла, нажмите по нему левой кнопкой
                      мыши
                    </p>

                    {selectedHall ? (
                      <ShowPlaces
                        selectedHall={selectedHall}
                        onChangeSeat={(rowIndex, seatIndex, value) => {
                          if (!selectedHall) return;

                          const newConfig = selectedHall.hall_config.map(
                            (row, rIdx) =>
                              row.map((seat, sIdx) => {
                                if (rIdx === rowIndex && sIdx === seatIndex) {
                                  return value;
                                }
                                return seat;
                              }),
                          );

                          setSelectedHall({
                            ...selectedHall,
                            hall_config: newConfig as HallSeatType[][],
                          });
                        }}
                      />
                    ) : (
                      ""
                    )}

                    <div className={style.containerBtn}>
                      <button
                        type="button"
                        className={style.extraBtn}
                        onClick={() => setSelectedHall(halls[0])}
                      >
                        Отмена
                      </button>
                      <button
                        type="button"
                        className={style.mainBtn}
                        onClick={saveSelectedHall}
                      >
                        Сохранить
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <HeaderAdminComponent
        Title="Конфигурация цен"
        setEditState={setHallPrice}
        hallConfig={hallConfig}
        type="usual"
      />

      {hallPrice ? (
        <section className={style.content}>
          <div className={style.contentItem}>
            <div className={style.selectBlock}>
              <span>Выберите зал для конфигурации:</span>
              <div>
                {halls.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`${style.configButton} ${selectedHall?.id === item.id ? style.configButtonActive : ""}`}
                    onClick={() => handleSelectedHall(item.id)}
                  >
                    {item.hall_name}
                  </button>
                ))}
              </div>
              <br></br>
              <br></br>
              <span>Установите цены для типов кресел:</span>
              <form>
                <div className={style.inputConfig}>
                  <div className={style.inputLabel}>
                    <label htmlFor="defaultPrice">Цена, рублей</label>
                    <input
                      id="defaultPrice"
                      className={style.inputPrice}
                      value={selectedHall?.hall_price_standart ?? ""}
                      onChange={(e) => handlePriceChange(e, "standart")}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>
                  <span>
                    {" "}
                    за <div className={style.defaultSeat}></div> обычные кресла
                  </span>
                  <div className={style.inputLabel}>
                    <label htmlFor="vipPrice">Мест, шт</label>
                    <input
                      className={style.inputPrice}
                      id="vipPrice"
                      value={selectedHall?.hall_price_vip ?? ""}
                      onChange={(e) => handlePriceChange(e, "vip")}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>
                  <span className={style.Con}>
                    за <div className={style.vipSeat}></div> обычные кресла
                  </span>
                </div>
                <span className={style.error}>{error}</span>
                <div className={style.containerBtn}>
                  <button
                    type="button"
                    className={style.extraBtn}
                    onClick={() => setSelectedHall(halls[0])}
                  >
                    Отмена
                  </button>
                  <button
                    className={style.mainBtn}
                    onClick={saveSelectedPrice}
                    type="button"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : (
        ""
      )}

      <HeaderAdminComponent
        Title="Сетка сеансов"
        setEditState={setHallSeansGrid}
        hallConfig={hallConfig}
        type="usual"
      />

      {openAddFilmPopap && (
        <AddFilm
          onClose={() => setOpenAddFilmPopap(false)}
          onSuccess={async () => await loadHalls()}
        />
      )}

      {openAddSessionPopap && (
        <AddSession
          halls={halls}
          films={films}
          selectedHallId={selectedHallId}
          selectedFilmId={selectedFilmId}
          onClose={() => {
            setSelectedFilmId(null);
            setSelectedHallId(null);
            loadHalls();
            setOpenAddSessionPopap(false);
          }}
        />
      )}

      {hallSeansGrid && (
        <section className={style.content}>
          <div className={style.contentItem}>
            <div className={style.selectBlock}>
              <div className={style.filmArea}>
                <button
                  className={style.mainBtn}
                  onClick={() => setOpenAddFilmPopap(true)}
                >
                  Добавить фильм
                </button>
              </div>
              <div className={style.filmArea}>
                {films.map((film) => {
                  initColor(film.id);

                  return (
                    <ul
                      key={film.id}
                      className={style.cart}
                      style={{ backgroundColor: colors[film.id] }}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("filmId", String(film.id));
                      }}
                    >
                      <img src={film.film_poster ?? noPhoto} alt="poster" />

                      <div className={style.filmInfo}>
                        <h3>{film.film_name}</h3>
                        <p>{film.film_duration} минут</p>
                      </div>

                      <button
                        className={style.basket}
                        onClick={() => {
                          setSelectedFilm(film);
                          setOpenModalDeleted(true);
                        }}
                      ></button>
                    </ul>
                  );
                })}
              </div>
              {selectedFilm && openModalDeleted && (
                <DeletePopap
                  onClose={() => setOpenModalDeleted(false)}
                  actionName="Удаление фильма"
                  componentText="Вы точно хотите удалить фильм:"
                  componentElement={selectedFilm.film_name}
                  onDelete={async () => {
                    handleDeleteFilm(selectedFilm.id);
                    setOpenModalDeleted(false);
                    setSelectedFilm(null);
                  }}
                />
              )}
              <br></br>

              <div className={style.timeLineArea}>
                {halls.map((hall) => {
                  const hallSeances = seances
                    .filter((s) => s.seance_hallid === hall.id)
                    .sort(
                      (a, b) =>
                        timeToMinutes(a.seance_time) -
                        timeToMinutes(b.seance_time),
                    );

                  let lastRight = 0;

                  return (
                    <div key={hall.id}>
                      <h3 className={style.hallName}>{hall.hall_name}</h3>

                      <div className={style.hallContainer}>
                        <div>
                          <ul
                            className={style.basketDropZone}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              setSelectedSeanceId(draggedSeanceId);
                              setOpenDeleteSeancePopap(true);
                              // setIsDraggingSeance(false);
                              setDraggedSeanceId(null);
                            }}
                          ></ul>

                          {openDeleteSeancePopap && selectedSeanceId && (
                            <DeletePopap
                              actionName="Удаление сеанса"
                              componentText="Вы точно хотите удалить сеанс: "
                              componentElement={String(selectedSeanceId)}
                              onClose={() => setOpenDeleteSeancePopap(false)}
                              onDelete={async () => {
                                await handleDeleteSeanse(selectedSeanceId);
                                setOpenDeleteSeancePopap(false);
                                setSelectedSeanceId(null);
                              }}
                            />
                          )}
                        </div>

                        <ul
                          className={style.filmsTimeLine}
                          onDragOver={(e) => e.preventDefault()}
                          role="dropzone"
                          onDrop={(e) => {
                            e.preventDefault();
                            const filmId = Number(
                              e.dataTransfer.getData("filmId"),
                            );
                            setSelectedFilmId(filmId);
                            setSelectedHallId(hall.id);
                            setOpenAddSessionPopap(true);
                          }}
                        >
                          {hallSeances.map((s) => {
                            const film = films.find(
                              (f) => f.id === s.seance_filmid,
                            );
                            if (!film) return null;

                            const SCALE = 0.5;
                            const MAX_MINUTES = 1440;

                            const start = timeToMinutes(s.seance_time);
                            const duration = Number(film.film_duration);
                            const end = start + duration;
                            const visibleDuration = Math.min(
                              duration,
                              MAX_MINUTES - start,
                            );

                            let left = start * SCALE;
                            const width = Math.max(
                              visibleDuration * SCALE - 10,
                              90,
                            );

                            if (left < lastRight) left = lastRight + 5;
                            lastRight = left + width;

                            return (
                              <ul
                                key={s.id}
                                className={style.sessionBlock}
                                style={{
                                  left,
                                  width,
                                  backgroundColor: colors[film.id],
                                }}
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData(
                                    "seanceId",
                                    String(s.id),
                                  );
                                  setDraggedSeanceId(s.id);
                                  // setIsDraggingSeance(true);
                                  // console.log('drag start', draggedSeanceId);
                                }}
                                onDragEnd={() => {
                                  // setIsDraggingSeance(false);
                                  setDraggedSeanceId(null);
                                  // console.log('drag end', draggedSeanceId);
                                }}
                              >
                                <b>{film.film_name}</b>
                                <br />
                                {s.seance_time} –{" "}
                                {minutesToTime(Math.min(end, MAX_MINUTES))}
                              </ul>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={style.containerBtn}>
                <button type="button" className={style.extraBtn}>
                  Отмена
                </button>
                <button
                  className={style.mainBtn}
                  type="button"
                  onClick={() => loadHalls()}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <HeaderAdminComponent
        Title="Открыть продажи"
        setEditState={setOpenSells}
        hallConfig={hallConfig}
        type="last"
      />

      {openSells && (
        <OpenSales
          halls={halls}
          selectedHall={selectedHall}
          handleSelectedHall={handleSelectedHall}
          loadHalls={loadHalls}
        />
      )}
    </main>
  );
}
