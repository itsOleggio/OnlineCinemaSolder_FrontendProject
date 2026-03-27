import { useParams, useLocation } from "react-router-dom";
import style from "./PaymentPage.module.css";
import mainStyle from "./../ClientPage/ClientPage.module.css";
import { Header } from "../../components/Header/Header";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { SelectPlacesClient } from "../../components/SelectPlacesClient/SelectPlacesClient";
import type { ITicket } from "../../model/ITicket";
import convertName from "../../utils/convertHallsName";
import { buyTicket } from "../../service/ticketAPI";
import ReactQRCode from "react-qr-code";

export function PaymentPage() {
  const { seanceId } = useParams();
  const location = useLocation();

  const { filmName, hallName, time, defaultPrice, vipPrice } =
    location.state ?? {};

  const today = dayjs().format("YYYY-MM-DD");

  const [selectedSeats, setSelectedSeats] = useState<ITicket[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [getQr, setGetQr] = useState(false);
  const [tickets, setTickets] = useState<ITicket[]>([]);

  useEffect(() => {
    document.title =
      "Покупка билета" +
      " | " +
      filmName +
      " | " +
      convertName(hallName) +
      " | " +
      time;
  }, []);

  const totalPrice = selectedSeats.reduce(
    (acc, ticket) => acc + ticket.price,
    0,
  );

  const handleBuyTicket = async () => {
    const res = await buyTicket(Number(seanceId), today, selectedSeats);
    if (res.data.success) {
      const newTickets = res.data.result.map((t: ITicket) => t);
      setTickets(newTickets);
      setGetQr(true);
    } else {
      alert("Произошла ошибка при покупке билетов");
    }
  };

  return (
    <div className={mainStyle.backgroundImage}>
      <main>
        <div className={mainStyle.headerContainer}>
          <Header headerTitle="" />
        </div>

        <div className={style.paymentContainer}>
          {!isConfirmed ? (
            <>
              <div className={style.infoBlock}>
                <h2>{filmName}</h2>
                <p className={style.hallInfo}>Зал: {hallName}</p>
                <p className={style.timeInfo}>Время: {time}</p>
              </div>
              <SelectPlacesClient
                seanceId={Number(seanceId)}
                date={today}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                defaultPrice={defaultPrice}
                vipPrice={vipPrice}
              />

              <div className={style.btnPlace}>
                <button
                  type="button"
                  onClick={() => setIsConfirmed(true)}
                  disabled={selectedSeats.length === 0}
                >
                  Забронировать
                </button>
              </div>
            </>
          ) : (
            <div className={style.ticketContainer}>
              <div className={style.ticketTitle}>
                <h3>Вы выбрали билеты:</h3>
              </div>

              <div className={style.infoBlock}>
                <div className={style.infoRow}>
                  <span>На фильм: </span>
                  <b>{filmName}</b>
                </div>

                <div className={style.infoRow}>
                  <span>Места:</span>
                  {selectedSeats.map((seat, index) => (
                    <b key={index}>
                      {" "}
                      Ряд: {Number(seat.row) + 1}, Место:{" "}
                      {Number(seat.place) + 1}
                    </b>
                  ))}
                </div>

                <div className={style.infoRow}>
                  <span>В зал:</span>
                  <b>{convertName(hallName)}</b>
                </div>

                <div className={style.infoRow}>
                  <span>Начало сеанса:</span>
                  <b>{time}</b>
                </div>

                <div className={style.infoRow}>
                  <span>Стоимость: </span>
                  <b>{totalPrice}</b>
                  <span>рублей</span>
                </div>
              </div>

              <div className={style.btnPlace}>
                {!getQr ? (
                  <button type="button" onClick={handleBuyTicket}>
                    Получить код бронирования
                  </button>
                ) : (
                  <div className={style.qrContainer}>
                    <ReactQRCode value={JSON.stringify(tickets)} size={100} />
                  </div>
                )}
              </div>

              <div className={style.footerBlock}>
                {getQr ? (
                  <span>
                    Покажите QR-код нашему контроллеру для подтверждения
                    бронирования.
                  </span>
                ) : (
                  <span>
                    После оплаты билет будет доступен в этом окне, а также
                    придёт вам на почту. Покажите QR-код нашему контроллёру у
                    входа в зал.
                  </span>
                )}
                <span>Приятного просмотра!</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
