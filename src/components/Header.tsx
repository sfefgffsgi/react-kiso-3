import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "../store";
import axios from "axios";

import { url } from "../const";
import { signOut } from "../authSlice";
import "./header.scss";

export const Header = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies();
  const handleSignOut = () => {
    dispatch(signOut());
    removeCookie("token");
    navigate("/login");
  };
  const [userName, setUserName] = useState("");
  // const [cookies] = useCookies();
  useEffect(() => {
    axios
      .get(`${url}/users`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setUserName(res.data.name);
      })
      .catch((err) => {
        console.log(`ユーザーの取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <header className="header">
      <h1>書籍レビューアプリ</h1>
      {auth ? (
        <div className="w-1/4 text-right pr-2">
          <Link to="/profile" className="font-semibold my-10 mx-5 text-white">
            {userName}
          </Link>
          <button onClick={handleSignOut} className="sign-out-button my-10">
            ログアウト
          </button>
        </div>
      ) : (
        <Link to="/login" className="font-semibold my-10 mx-5 text-white">
          ログイン
        </Link>
      )}
    </header>
  );
};
