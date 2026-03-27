import { Header } from "../../components/Header/Header";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { Editor } from "../../components/Editor/Editor";

import style from "./AdminPage.module.css";
import { useEffect, useState } from "react";

export function AdminPage() {
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Страница администрирования сеансов";
  }, []);

  return (
    <div className={style.backgroundImage}>
      <div className={style.overlay}>
        <main className={style.main}>
          <Header headerTitle="Администраторррская" />

          {auth ? <Editor /> : <LoginForm setAuth={setAuth} />}
        </main>
      </div>
    </div>
  );
}
