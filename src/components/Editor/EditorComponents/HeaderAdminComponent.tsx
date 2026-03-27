import style from "../Editor.module.css";

interface HeaderAdminComponentProps {
  readonly Title: string;
  readonly setEditState: React.Dispatch<React.SetStateAction<boolean>>;
  readonly hallConfig: boolean;
  readonly type: "first" | "usual" | "last";
}

export function HeaderAdminComponent({
  Title,
  setEditState,
  hallConfig,
  type,
}: HeaderAdminComponentProps) {
  return (
    <article className={style.section}>
      <div className={style.title}>
        <div className={style.decElement}>
          <div
            className={[
              style.dot,
              type !== "first" && style.upperLine,
              type !== "last" && style.lowerLine,
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </div>
        <div className={style.titleBlock}>
          <span>{Title.toUpperCase()}</span>
          <button
            type="button"
            className={`${style.closeSection} ${!hallConfig ? style.rotated : ""}`}
            onClick={() => setEditState((prev) => !prev)}
          ></button>
        </div>
      </div>
    </article>
  );
}
