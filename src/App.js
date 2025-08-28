import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import Home from "./component/Home/home";

import "./assets/css/main.css";
import "./assets/css/responsive.css";
import "./assets/css/style.css";

import ExternalModal from "./component/CommonComponent/ExternalModal";
import Contactus from "./component/Contact/Contact";
import Error404 from "./component/Error404";
import ScrollToTop from "./component/Footer/ScrollToTop";
import Footer from "./component/Footer/footer";
import Header from "./component/Header/header";
import NewsUpdate from "./component/Header/newsUpdate";
import ScreenReaderAccess from "./component/Home/Screenreader";
import Sitemap from "./component/HeaderComponent/Sitemap";
import Aboutus from "./component/Home/aboutus";

import FeedbackForm from "./component/FeedBack/Feedback";
import Gallery from "./component/Home/Gallery";
import Circular from "./component/Home/Circulars";
import Notification from "./component/Home/Notifications";
import Tender from "./component/Home/Tender";
import CouncilMember from "./component/Home/CouncilMembers";
import Videos from "./component/Home/Videos";
import Downloads from "./component/Home/Downloads";
import Disclaimer from "./component/Home/Disclaimer";
import Programs from "./component/Home/Programs";
import FAQ from "./component/Home/FAQ";
import Help from "./component/Home/Help";
import SearchResults from "./component/Home/SearchResults";
import Institute from "./component/Home/Institute";
import Ndcsss from "./component/Home/NDCSSS";
import NoticeBoard from "./component/Home/NoticeBoard";
import GoverningCouncil from "./component/Home/GoverningCouncil";
import Directorate from "./component/Home/Director";
import EducationInfo from "./component/Home/EducationInfo";
import Examination from "./component/Home/Examination";
import Affiliation from "./component/Home/Affiliation";
import RTI from "./component/Home/RTI";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [externalLink, setExternalLink] = useState("");

  const openModal = (url) => {
    setExternalLink(url);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setExternalLink("");
  };

  const handleAccept = () => {
    window.open(externalLink, "_blank", "noopener,noreferrer");
    closeModal();
  };

  useEffect(() => {
    const handleLinkClick = (e) => {
      const anchor = e.target.closest("a"); // Find the closest anchor element
      if (anchor && anchor.getAttribute("target") === "_blank") {
        const href = anchor.getAttribute("href");

        // Ensure the href is an external link
        if (href.startsWith("http") || href.startsWith("https")) {
          e.preventDefault();
          openModal(href); // Open modal and pass the URL
        }
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  return (
    <>
      <Header />
      <NewsUpdate />
      <div className="content" id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/governing-council" element={<GoverningCouncil />} />
          <Route path="/director" element={<Directorate />} />

          <Route path="/councilMembers" element={<CouncilMember />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/circulars" element={<Circular />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/tenders" element={<Tender />} />
          <Route path="/ndcsss" element={<Ndcsss />} />
          <Route path="/notice-board" element={<NoticeBoard />} />
          <Route path="/examination" element={<Examination />} />
          <Route path="/education-information" element={<EducationInfo />} />
          <Route path="/affiliation" element={<Affiliation />} />
          <Route path="/rti" element={<RTI />} />

          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/feedback" element={<FeedbackForm />} />

          <Route path="/programs" element={<Programs />} />

          <Route path="/institute" element={<Institute />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<Help />} />
          <Route path="/tenders" element={<Tender />} />

          <Route path="/contact" element={<Contactus />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/ScreenReader" element={<ScreenReaderAccess />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Keep this route at last  */}
          <Route path="/*" element={<Error404 />} />
        </Routes>
      </div>

      <Footer />
      <ScrollToTop />

      <ExternalModal
        showModal={showModal}
        handleClose={closeModal}
        externalLink={externalLink}
        message={
          <>
            <div className="text-center px-3 mt-2">
              <p>
                <b>
                  You are being redirected to an external website. Please note that we are not responsible for external websites content &
                  privacy policies.
                </b>
              </p>
            </div>
          </>
        }
        onAccept={handleAccept}
        size={"lg"}
      />
    </>
  );
}

export default App;
