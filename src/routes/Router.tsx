import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "../store";

import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";

export const Router = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {auth ? (
          <>
            <Route path="/" element={<Home />} />
            {/* <Route path="/task/new" element={<NewTask />} />
            <Route path="/list/new" element={<NewList />} />
            <Route path="/lists/:listId/tasks/:taskId" element={<EditTask />} />
            <Route path="/lists/:listId/edit" element={<EditList />} /> */}
          </>
        ) : (
          <Route path="/" element={<Navigate replace to="/login" />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
