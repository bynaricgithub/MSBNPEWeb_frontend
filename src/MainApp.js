import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import App from "./App";
import Login from "./component/Super/Login";
import Authenticator from "./utils/Authenticator";
import Navigator from "./utils/Navigator";

import "react-toastify/dist/ReactToastify.css";
import "./assets/css/admin.css";

const MainApp = () => {
  //-------------- Sidebar Toggle Function ---------------
  const [isSidebarActive, setIsSidebarActive] = useState(true);
  const sidebarToggle = () => {
    setIsSidebarActive(!isSidebarActive);
    document.getElementById("sidebar")?.classList.toggle("active");
  };

  const { myUser } = useSelector((state) => state.currentUser);
  const { show } = useSelector((state) => state.message);

  return (
    <BrowserRouter>
      <Navigator />
      {show && <div className="longloader"></div>}

      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={<Authenticator />} />
        <Route path="/*" element={<App />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} stacked={true} />
    </BrowserRouter>
  );
};

export default MainApp;
