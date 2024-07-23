import axios from "axios";
import Compressor from "compressorjs";
import { useCookies } from "react-cookie";
import { Navigate, useNavigate, Link } from "react-router-dom";
import React, { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "../store";

import { Header } from "../components/Header";
import "./signUp.scss";
import { signIn } from "../authSlice";
import { url } from "../const";

type Inputs = {
  icon: string;
  name: string;
  email: string;
  password: string;
};

export const SignUp = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, setCookie] = useCookies();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();
  const imgRef = useRef<HTMLInputElement>(null);
  const [iconFile, setIconFile] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const onSignIn: SubmitHandler<Inputs> = (data) => {
    axios
      .post(`${url}/users`, {
        name: data.name,
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        //画像アップロード
        uploadIcon(res.data.token);
        //ログイン
        setCookie("token", res.data.token);
        dispatch(signIn());
        // navigate("/");
      })
      .catch((err) => {
        setErrorMessage(`ユーザー作成に失敗しました。${err}`);
      });
  };

  function uploadIcon(token: string) {
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    const file = new FormData();
    if (iconFile !== null) {
      file.append("icon", iconFile);
    }

    axios
      .post(`${url}/uploads`, file, {
        headers: headers,
      })
      .then((res) => {
        console.log(res);
        // navigate("/");
      })
      .catch((err) => {
        setErrorMessage(`画像のアップロードに失敗しました。${err}`);
      });
  }

  const handleIconInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files == null || files.length == 0) {
      return;
    }

    // 画像圧縮
    new Compressor(files[0], {
      quality: 0.6,
      success(result) {
        if (result.size > 1000000) {
          setError("icon", {
            type: "value",
            message: "ファイルサイズが大きすぎます。",
          });
        }
        //プレビュー表示
        setIconFile(result);
      },
      error(err) {
        console.log(err);
        setError("icon", {
          type: "value",
          message: err.message,
        });
      },
    });
  };

  const handleIconClearButtonClick = () => {
    const iconInput = document.getElementsByClassName(
      "icon-input"
    ) as HTMLCollectionOf<HTMLInputElement>;

    iconInput[0].value = "";
    setIconFile(null);
  };

  return (
    <div>
      <Header />
      <main className="signup">
        <h2>新規作成</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="signup-form" onSubmit={handleSubmit(onSignIn)}>
          <label className="name-label">名前(必須)</label>
          <br />
          <input
            type="text"
            className="name-input"
            {...register("name", {
              required: "名前を入力してください",
            })}
          />
          {errors.name?.message && (
            <p className="error-message" id="error-message-name">
              {errors.name?.message}
            </p>
          )}
          <br />
          <label className="email-label">メールアドレス(必須)</label>
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
          <label className="password-label">パスワード(必須)</label>
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
          <label className="name-label">アイコン</label>
          <br />
          <input
            type="file"
            className="icon-input"
            accept="image/png, image/jpeg"
            {...register("icon", {})}
            onChange={handleIconInput}
            ref={imgRef}
          />
          {errors.icon?.message && (
            <p className="error-message" id="error-message-icon">
              {errors.icon?.message}
            </p>
          )}
          <br />
          <label>画像プレビュー</label>
          <button
            type="button"
            className="img-clear-button"
            onClick={handleIconClearButtonClick}
          >
            画像クリア
          </button>
          <br />
          <div className="img-preview-box">
            {iconFile !== null ? (
              <img
                id="img-preview"
                src={iconFile !== null ? URL.createObjectURL(iconFile) : ""}
              ></img>
            ) : (
              <p></p>
            )}
          </div>
          <br />
          <button type="submit" className="signup-button">
            作成
          </button>
        </form>
        <Link to="/login">ログイン</Link>
      </main>
    </div>
  );
};
