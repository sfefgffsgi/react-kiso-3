import axios from "axios";
import Compressor from "compressorjs";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { Header } from "../components/Header";
import "./profile.scss";
import { url } from "../const";

type Inputs = {
  icon: string;
  name: string;
  // email: string;
  // password: string;
};

export const Profile = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [iconFile, setIconFile] = useState<Blob | null>(null);
  const [iconURL, setIconURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { ref, ...rest } = register("icon", {
    required: "画像を選択してください",
  });

  const updateUser: SubmitHandler<Inputs> = (data) => {
    axios
      .put(
        `${url}/users`,
        {
          name: data.name,
        },
        {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then((res) => {
        //画像アップロード
        uploadIcon();
      })
      .catch((err) => {
        setErrorMessage("ユーザー情報の更新に失敗しました。");
        console.log(err);
      });
  };

  function uploadIcon() {
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${cookies.token}`,
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
        alert("ユーザー情報を更新しました。");
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage("画像のアップロードに失敗しました。");
        console.log(err);
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
        setIconFile(result);
        if (result != null) {
          setIconURL(URL.createObjectURL(result));
        }
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
    const iconInput = imgRef.current;
    if (iconInput != null) {
      iconInput.value = "";
    }
    setIconFile(null);
    setIconURL("");
  };

  useEffect(() => {
    axios
      .get(`${url}/users`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setValue("name", res.data.name);
        setValue("icon", res.data.iconUrl);
        // const iconInput = imgRef.current;
        // if (iconInput != null) {
        //   iconInput.value = res.data.iconUrl;
        // }
        // setIconFile(res.data.iconUrl);
        setIconURL(res.data.iconUrl);
      })
      .catch((err) => {
        console.log(`ユーザーの取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="profile">
        <h2>ユーザー情報編集</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="profile-form" onSubmit={handleSubmit(updateUser)}>
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
          <label className="name-label">アイコン(必須)</label>
          <br />
          <input
            type="file"
            className="icon-input"
            accept="image/png, image/jpeg"
            {...rest}
            name="icon"
            ref={(e) => {
              ref(e);
              imgRef.current = e;
            }}
            onChange={handleIconInput}
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
            {iconURL !== "" ? (
              <img id="img-preview" src={iconURL}></img>
            ) : (
              <p></p>
            )}
          </div>
          <br />
          <button type="submit" className="profile-button">
            更新
          </button>
        </form>
        <Link to="/">Home</Link>
      </main>
    </div>
  );
};
