import type { IUser } from "../../model/IUser";
import style from "./LoginForm.module.css";
import { authUser } from "./../../service/userAPI";
import { useState } from "react";

interface LoginFormProp {
  readonly setAuth: (value: boolean) => void;
}

export function LoginForm({ setAuth }: LoginFormProp) {
  const [userData, setUserData] = useState<IUser>({
    login: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const AuthHandler = async (): Promise<void> => {
    setError("");
    if (!userData.login) {
      setError("Заполните поле логина");
      return;
    }
    if (typeof userData.password !== "string" || !userData.password) {
      setError("Заполните поле пароля ");
      return;
    } else {
      const data = await authUser(
        userData.login.trim(),
        userData.password.trim(),
      );

      if (data.data.success) {
        setAuth(true);
      } else {
        setError(data.data.error);
      }
    }
  };

  return (
    <section className={style.loginForm}>
      <div className={style.title}>{"Авторизация".toUpperCase()}</div>
      <form
        className={style.form}
        onSubmit={(e) => {
          e.preventDefault();
          AuthHandler();
        }}
      >
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          placeholder="example@domain.xyz"
          id="email"
          onChange={(e) => {
            setError("");
            setUserData((prev) => ({
              ...prev,
              login: e.target.value,
            }));
          }}
        />
        <label htmlFor="pass">Пароль</label>
        <input
          type="password"
          placeholder="Пароль"
          id="pass"
          onChange={(e) => {
            setError("");
            setUserData((prev) => ({
              ...prev,
              password: e.target.value,
            }));
          }}
        />
        <button type="submit">{"Авторизоваться".toUpperCase()}</button>
        <br></br>
        <span className={style.error}>{error}</span>
      </form>
    </section>
  );
}
