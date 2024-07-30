import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "../store";

import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { Profile } from "../pages/Profile";
import { New } from "../pages/New";
import { Datail } from "../pages/Datail";
import { Edit } from "../pages/Edit";

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
            <Route path="/profile" element={<Profile />} />
            <Route path="/new" element={<New />} />
            <Route path="/datail/:id" element={<Datail />} />
            <Route path="/edit/:id" element={<Edit />} />
          </>
        ) : (
          <Route path="/" element={<Navigate replace to="/login" />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
