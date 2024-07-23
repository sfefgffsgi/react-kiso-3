import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { store } from "./store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </Provider>
  </React.StrictMode>,
);
