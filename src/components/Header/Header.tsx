import logo from "./../../assets/icons/logo.png";
import style from "./Header.module.css";
import { NavLink } from "react-router-dom";

type HeaderProps = Readonly<{
  headerTitle: string | "";
}>;

export function Header({ headerTitle }: HeaderProps) {
  return (
    <div className={style.logo}>
      <NavLink to="/">
        <img className={style.logoIcon} src={logo} alt="logo" />
      </NavLink>
      <span className={style.subtitle}>{headerTitle.toUpperCase()}</span>
    </div>
  );
}
