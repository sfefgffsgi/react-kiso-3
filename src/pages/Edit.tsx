import axios from "axios";
import { useCookies } from "react-cookie";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
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

export const Edit = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const { id } = useParams();
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
      .put(
        `${url}/books/${id}`,
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
        alert("レビューを更新しました。");
        navigate(`/detail/${id}`);
      })
      .catch((err) => {
        setErrorMessage("レビューの更新に失敗しました。");
        console.log(err);
      });
  };

  function handleDeleteClick() {
    axios
      .delete(`${url}/books/${id}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        alert("レビューを削除しました。");
        navigate("/");
      })
      .catch((err) => {
        console.log(`データの削除に失敗しました。${err}`);
      });
  }

  useEffect(() => {
    axios
      .get(`${url}/books/${id}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setValue("title", res.data.title);
        setValue("url", res.data.url);
        setValue("detail", res.data.detail);
        setValue("review", res.data.review);
      })
      .catch((err) => {
        console.log(`データの取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="profile">
        <h2>書籍レビュー編集</h2>
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
          <button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white block m-auto w-24 h-10 mt-1"
            onClick={handleDeleteClick}
          >
            削除
          </button>
        </form>
        <Link to={`/detail/${id}`}>Back</Link>
        <br />
        <Link to="/">Home</Link>
      </main>
    </div>
  );
};
