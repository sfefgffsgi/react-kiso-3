import axios from "axios";
import { useCookies } from "react-cookie";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "../store";

import { Header } from "../components/Header";
import "./login.scss";
import { signIn } from "../authSlice";
import { url } from "../const";

type Inputs = {
  email: string;
  password: string;
};

export const Login = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, setCookie] = useCookies();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [errorMessage, setErrorMessage] = useState("");

  const onSignIn: SubmitHandler<Inputs> = (data) => {
    axios
      .post(`${url}/signin`, { email: data.email, password: data.password })
      .then((res) => {
        setCookie("token", res.data.token);
        dispatch(signIn());
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage(`ログインに失敗しました。${err}`);
      });
  };

  if (auth) return <Navigate replace to="/" />;

  return (
    <div>
      <Header />
      <main className="login">
        <h2>ログイン</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="login-form" onSubmit={handleSubmit(onSignIn)}>
          <label className="email-label">メールアドレス</label>
          <br />
          <input
            type="email"
            className="email-input"
            {...register("email", {
              required: "メールアドレスを入力してください",
            })}
          />
          {errors.email?.message && (
            <p className="error-message" id="error-message-email">
              {errors.email?.message}
            </p>
          )}
          <br />
          <label className="password-label">パスワード</label>
          <br />
          <input
            type="password"
            className="password-input"
            {...register("password", {
              required: "パスワードを入力してください",
            })}
          />
          {errors.password?.message && (
            <p className="error-message" id="error-message-password">
              {errors.password?.message}
            </p>
          )}
          <br />
          <button type="submit" className="login-button">
            ログイン
          </button>
        </form>
        <Link to="/signup">新規作成</Link>
      </main>
    </div>
  );
};
