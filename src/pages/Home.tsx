import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { url } from "../const";
import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";

export const Home = () => {
  const [books, setLists] = useState([]);
  const [offset, setOffset] = useState(0);

  const fetchThreadList = () => {
    axios
      .get(`${url}/public/books?offset=${offset}`, {})
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        console.log(`リストの取得に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    fetchThreadList();
  }, []);

  return (
    <div>
      <Header />
      <main>
        <h2>書籍一覧</h2>
        <Link to="/new">書籍レビュー作成</Link>
        <div className="md:container md:mx-auto">
          <Books books={books} />
          <Pagination
            offset={offset}
            setOffset={setOffset}
            onClickFunction={fetchThreadList}
            retData={books}
          />
        </div>
      </main>
    </div>
  );
};

type propsItems = {
  books: booksItems[];
};

type booksItems = {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
  isMine: boolean;
};
const Books = (props: propsItems) => {
  const { books } = props;
  const navigate = useNavigate();
  if (books === undefined) {
    return <></>;
  }

  if (books.length === 0) {
    return <></>;
  }

  return (
    <ul className="m-5 ">
      {books.map((book) => (
        <li id={book.id}>
          <div
            onClick={() => {
              navigate(`/datail/${book.id}`);
            }}
          >
            {book.title}
          </div>
        </li>
      ))}
    </ul>
  );
};
