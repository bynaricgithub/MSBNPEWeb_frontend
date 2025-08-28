/* eslint-disable eqeqeq */
import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import {
  // useDispatch,
  useSelector,
} from "react-redux";
import {
  Link,
  // useNavigate
} from "react-router-dom";
// import { logout } from "../Store/AllReducers/userSlice";

export const sidebarList = {
  Dashboard: { path: "/home", icon: "fa-home" },
  "Manage Links": { path: "/manageLinks", icon: "fa-link" },
  "Manage Latest Update": {
    path: "/manageLatestUpdate",
    icon: "fa-bell",
  },
  "Manage Slider Images": {
    path: "/manageSliderImages",
    icon: "fa-image",
  },
  "Manage Members": { path: "/manageMembers", icon: "fa-user" },
  "Manage Gallery": { path: "/manageGallery", icon: "fa-image" },
  "Manage Notice Board": { path: "/manageNoticeBoard", icon: "fa-newspaper" },
  // "Manage Tabs": { path: "/manageCircular", icon: "fa-bullhorn" },
  "Manage Video Gallery": { path: "/manageVideoGallery", icon: "fa-video" },
  Feedback: { path: "/manageFeedback", icon: "fa-newspaper" },
  "Manage Programs": { path: "/managePrograms", icon: "fa-boxes" },
  "Manage Institute": { path: "/manageInstitute", icon: "fa-building" },
  "Manage FAQ's": { path: "/manageFAQ", icon: "fa-question-circle" },
  "Manage Category": { path: "/manageMasterCategory", icon: "fa-users" },
  "Manage File Uploads": { path: "/manageFileUploads", icon: "fa-file-pdf" },
  "Manage Page Contents": { path: "/manageContent", icon: "fa-file" },
};

const BASE_PATH = "/admin";

const SidebarMain = () => {
  const [open, setOpen] = useState("");
  const [currentTab, setCurrentTab] = useState("");
  const { myUser } = useSelector((state) => state.currentUser);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleToggle = (key) => {
    setOpen((prev) => (prev === key ? "" : key));
  };

  return (
    <nav id="sidebar">
      <div className="p-2 py-3 user-profile">
        <img src={myUser?.image || "/assets/images/user.png"} alt="User" />
        <div className="user-info">
          <h4>{myUser ? myUser.name : "No Name"}</h4>
        </div>
      </div>
      <ul className="list-unstyled components">
        {Object.keys(sidebarList).map((key, i) => (
          <li key={i} className="active">
            {Array.isArray(sidebarList[key]) ? (
              <>
                <span
                  onClick={() => handleToggle(key)}
                  aria-controls={key}
                  aria-expanded={open === key}
                  className="admin-mainHead w-100 border-0 text-left"
                  style={{ marginTop: "1px" }}
                  role="button"
                >
                  <span className="d-flex justify-content-between align-items-center">
                    <span>
                      <i className={`pe-2 fa ${sidebarList[key][0]?.icon || ""}`} style={{ width: "25px" }}></i>
                      {key}
                    </span>
                    {open === key ? <i className="fa fa-caret-up mx-2"></i> : <i className="fa fa-caret-down mx-2"></i>}
                  </span>
                </span>
                <Collapse in={open === key}>
                  <div id={key}>
                    <ul className="list-unstyled">
                      {sidebarList[key].map((item2, j) => (
                        <li key={j} onClick={() => setCurrentTab(item2.name)}>
                          <Link
                            to={{ pathname: BASE_PATH + item2.pathname }}
                            className="admin-subHead ps-4"
                            style={{
                              backgroundColor: item2.name === currentTab ? "#0d3582" : "",
                              color: item2.name === currentTab ? "#fff" : "",
                            }}
                          >
                            <i className={`pe-2 fa ${item2.icon}`}></i>
                            {item2.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Collapse>
              </>
            ) : (
              <Link
                to={{ pathname: BASE_PATH + sidebarList[key].path }}
                className="text-decoration-none admin-mainHead w-100 border-0 text-left"
                onClick={() => setCurrentTab(key)}
                aria-controls={key}
                aria-expanded={open === key}
                style={{ marginTop: "1px" }}
              >
                <i className={`pe-2 fa ${sidebarList[key].icon}`} style={{ width: "25px" }}></i>
                {key}
              </Link>
            )}
          </li>
        ))}
      </ul>
      {/* <div className="fixedBtn">
        <button
          onClick={() => dispatch(logout(navigate))}
          className="btn admin-btn-primary w-100 p-3 border-0"
        >
          <i className="pe-2 fa fa-sign-out-alt"></i>
          Logout
        </button>
      </div> */}
    </nav>
  );
};

export default SidebarMain;
