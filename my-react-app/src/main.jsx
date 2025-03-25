// import {StrictMode} from 'react'
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import Detail from "./pages/detail/Detail.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <HashRouter>
    <Routes>
      <Route path="/*" element={<App />} />
      {/* 详情页 */}
      <Route path="/detail" element={<Detail />} />
    </Routes>
  </HashRouter>
  // </StrictMode>,
);
