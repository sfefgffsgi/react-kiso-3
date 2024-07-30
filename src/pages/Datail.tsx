import { useCookies } from "react-cookie";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { Suspense, useState, useEffect } from "react";

import { Header } from "../components/Header";
import { Loader } from "../components/Loader";
import "./new.scss";
import { url } from "../const";

let bookData: any;

export const Datail = () => {
  return (
    <div>
      <Header />
      <main className="profile">
        <h2>書籍レビュー詳細</h2>
        <Suspense fallback={<Loader />}>
          <BookDatail />
        </Suspense>
        <Link to="/">Home</Link>
      </main>
    </div>
  );
};

const BookDatail = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const { id } = useParams();
  const getBookDatail = async (): Promise<any> => {
    const res = await fetch(`${url}/books/${id}`, {
      headers: {
        authorization: `Bearer ${cookies.token}`,
      },
    });

    return res.json();
  };

  useEffect(() => {
    bookData = null;
  }, []);

  if (!bookData) {
    throw getBookDatail().then((data) => (bookData = data));
  }

  return (
    <div>
      <ul>
        <li>タイトル：{bookData.title}</li>
        <li>URL：{bookData.url}</li>
        <li>詳細：{bookData.datail}</li>
        <li>レビュー：{bookData.review}</li>
        <li>レビュワー：{bookData.reviewer}</li>
      </ul>
      {bookData.isMine ? (
        <button
          type="button"
          onClick={() => {
            navigate(`/edit/${bookData.id}`);
          }}
        >
          編集
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};
