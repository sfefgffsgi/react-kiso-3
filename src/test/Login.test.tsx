import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store";

import { Login } from "../pages/Login";

test("フォームが表示されること", async () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByText("メールアドレス")).toBeInTheDocument();
  expect(screen.getByText("パスワード")).toBeInTheDocument();

  expect(screen.getByRole("textbox")).toBeTruthy();
  expect(screen.getByRole("button")).toBeTruthy();
});
