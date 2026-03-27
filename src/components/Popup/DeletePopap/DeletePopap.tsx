import style from "../Popup.module.css";
import closeIcon from "../../../assets/icons/close.png";
import { createPortal } from "react-dom";

interface DeletePopapProps {
  readonly actionName: string;
  readonly componentText: string;
  readonly componentElement: string;
  readonly onClose: () => void;
  readonly onDelete: () => Promise<void>;
}

export function DeletePopap({
  onClose,
  actionName,
  componentText,
  componentElement,
  onDelete,
}: DeletePopapProps) {
  return createPortal(
    <main className={style.popupContainer}>
      <article>
        <div className={style.popupTitle}>
          <h3 className={style.title}>{actionName}</h3>
          <button className={style.btnCross} onClick={onClose}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <div>
          <section>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={style.inputPlace}>
                <span>
                  {componentText + " "} <b>{componentElement}</b>
                </span>
              </div>
            </form>
            <div className={style.btnContainer}>
              <button onClick={onDelete}>Удалить</button>
              <button onClick={onClose}>Отмена</button>
            </div>
          </section>
        </div>
      </article>
    </main>,
    document.body,
  );
}
