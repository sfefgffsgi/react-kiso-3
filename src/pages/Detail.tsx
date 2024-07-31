import { useCookies } from "react-cookie";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Suspense, useEffect } from "react";

import { Header } from "../components/Header";
import { Loader } from "../components/Loader";
import "./new.scss";
import { url } from "../const";

let bookData: any;

export const Detail = () => {
  return (
    <div>
      <Header />
      <main className="profile">
        <h2>書籍レビュー詳細</h2>
        <Suspense fallback={<Loader />}>
          <BookDetail />
        </Suspense>
        <Link to="/">Home</Link>
      </main>
    </div>
  );
};

const BookDetail = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const { id } = useParams();
  const getBookDetail = async (): Promise<any> => {
    const res = await fetch(`${url}/books/${id}`, {
      headers: {
        authorization: `Bearer ${cookies.token}`,
      },
    });

    return res.json();
  };

  function handleClick() {
    console.log("click");
    navigate(`/edit/${id}`);
  }

  useEffect(() => {
    bookData = null;
  }, []);

  if (!bookData) {
    throw getBookDetail().then((data) => (bookData = data));
  }

  return (
    <div className="text-left">
      <ul>
        <li>タイトル：{bookData.title}</li>
        <li>
          URL：
          <a href="{bookData.url}">{bookData.url}</a>
        </li>
        <li>詳細：{bookData.detail}</li>
        <li>レビュー：{bookData.review}</li>
        <li>レビュワー：{bookData.reviewer}</li>
      </ul>
      {bookData.isMine ? (
        <button type="button" onClick={handleClick} className="block m-auto">
          編集
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};
