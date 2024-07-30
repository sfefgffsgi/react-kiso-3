import axios from "axios";
import { useCookies } from "react-cookie";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { Header } from "../components/Header";
import "./new.scss";
import { url } from "../const";

type Inputs = {
  title: string;
  url: string;
  detail: string;
  review: string;
};

export const New = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const [errorMessage, setErrorMessage] = useState("");

  const updateUser: SubmitHandler<Inputs> = (data) => {
    axios
      .post(
        `${url}/books`,
        {
          title: data.title,
          url: data.url,
          detail: data.detail,
          review: data.review,
        },
        {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then((res) => {
        alert("レビューを作成しました。");
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage("レビュー作成に失敗しました。");
        console.log(err);
      });
  };

  // useEffect(() => {
  //   axios
  //     .get(`${url}/users`, {
  //       headers: {
  //         authorization: `Bearer ${cookies.token}`,
  //       },
  //     })
  //     .then((res) => {
  //       setValue("name", res.data.name);
  //     })
  //     .catch((err) => {
  //       console.log(`データの取得に失敗しました。${err}`);
  //     });
  // }, []);

  return (
    <div>
      <Header />
      <main className="profile">
        <h2>書籍レビュー登録</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="profile-form" onSubmit={handleSubmit(updateUser)}>
          <label className="title-label">タイトル(必須)</label>
          <br />
          <input
            type="text"
            className="title-input"
            {...register("title", {
              required: "タイトルを入力してください",
            })}
          />
          {errors.title?.message && (
            <p className="error-message" id="error-message-title">
              {errors.title?.message}
            </p>
          )}
          <br />
          <label className="url-label">URL</label>
          <br />
          <input type="text" className="url-input" {...register("url")} />
          {errors.url?.message && (
            <p className="error-message" id="error-message-url">
              {errors.url?.message}
            </p>
          )}
          <br />
          <label className="detail-label">詳細</label>
          <br />
          <input type="text" className="detail-input" {...register("detail")} />
          {errors.detail?.message && (
            <p className="error-message" id="error-message-detail">
              {errors.detail?.message}
            </p>
          )}
          <br />
          <label className="review-label">レビュー(必須)</label>
          <br />
          <textarea
            className="review-input"
            {...register("review", {
              required: "レビューを入力してください",
            })}
          />
          {errors.review?.message && (
            <p className="error-message" id="error-message-review">
              {errors.review?.message}
            </p>
          )}
          <br />
          <button type="submit" className="submit-button">
            更新
          </button>
        </form>
        <Link to="/">Home</Link>
      </main>
    </div>
  );
};
