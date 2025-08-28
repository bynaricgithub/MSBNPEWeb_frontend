import React, { Suspense, lazy, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Error404 from "../component/Error404";
import CustomLoader from "../utils/CustomLoader";
import "../assets/css/admin.css";
import { useSelector } from "react-redux";
import TopBar from "./Topbar";
import SidebarMain from "./Sidebar";
import ManageInstitute from "../component/Super/ManageInstitute";

const ManageFeedback = lazy(() => import("../component/Super/ManageFeedback"));

const AdminHome = lazy(() => import("../component/Super/AdminHome"));
const ManageLinks = lazy(() => import("../component/Super/ManageLinks"));
const ManageSliderImages = lazy(() => import("../component/Super/ManageSliderImages"));
const ManageLatestUpdate = lazy(() => import("../component/Super/ManageLatestUpdate"));
const ManageNoticeBoard = lazy(() => import("../component/Super/ManageNoticeBoard"));
const ManageCircular = lazy(() => import("../component/Super/ManageCircular"));
const ManageGallery = lazy(() => import("../component/Super/ManageGallery"));
const ManageMembers = lazy(() => import("../component/Super/ManageMembers"));
const Managevideos = lazy(() => import("../component/Super/ManageVideos"));
const ManageVideoGallery = lazy(() => import("../component/Super/ManageVideoGallery"));
const ManagePrograms = lazy(() => import("../component/Super/ManagePrograms"));
const ManageFAQ = lazy(() => import("../component/Super/ManageFAQ"));
const ManageMasterCategory = lazy(() => import("../component/Super/ManageMasterCategory"));
const ManagePageContent = lazy(() => import("../component/Super/ManagePageContent"));
const ManageFileUploads = lazy(() => import("../component/Super/ManageFileUploads"));

function lazyLoader(route, children) {
  return <Route path={route} element={<Suspense fallback={<CustomLoader />}>{children}</Suspense>} />;
}

const Content = () => {
  //-------------- Sidebar Toggle Function ---------------
  const [isSidebarActive, setIsSidebarActive] = useState(true);
  const sidebarToggle = () => {
    setIsSidebarActive(!isSidebarActive);
    document.getElementById("sidebar")?.classList.toggle("active");
  };

  const { myUser } = useSelector((state) => state.currentUser);
  //   const { show } = useSelector((state) => state.message);

  return (
    <>
      <div className={`wrapper ${isSidebarActive ? "" : "side-collapsed"}`}>
        {myUser?.role === "1" && window.location.pathname.search("admin") > 0 && <SidebarMain />}
        {myUser?.role === "1" && <TopBar onSidebarToggle={sidebarToggle} />}

        <div id="content" className="px-3">
          <Routes>
            {lazyLoader("/", <AdminHome />)}
            {lazyLoader("/home", <AdminHome />)}
            {lazyLoader("/manageLinks", <ManageLinks />)}
            {lazyLoader("/manageSliderImages", <ManageSliderImages />)}
            {lazyLoader("/manageLatestUpdate", <ManageLatestUpdate />)}
            {lazyLoader("/manageGallery", <ManageGallery />)}
            {lazyLoader("/manageNoticeBoard", <ManageNoticeBoard />)}
            {lazyLoader("/manageCircular", <ManageCircular />)}
            {lazyLoader("/manageMembers", <ManageMembers />)}
            {lazyLoader("/managevideos", <Managevideos />)}
            {lazyLoader("/manageVideoGallery", <ManageVideoGallery />)}
            {lazyLoader("/manageFeedback", <ManageFeedback />)}
            {lazyLoader("/managePrograms", <ManagePrograms />)}
            {lazyLoader("/manageInstitute", <ManageInstitute />)}
            {lazyLoader("/manageMasterCategory", <ManageMasterCategory />)}
            {lazyLoader("/manageFAQ", <ManageFAQ />)}
            {lazyLoader("/manageFileUploads", <ManageFileUploads />)}
            {lazyLoader("/manageContent", <ManagePageContent />)}

            {/* ============================================ Keep this route last ============================================== */}
            <Route path="/*" element={<Error404 />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Content;
