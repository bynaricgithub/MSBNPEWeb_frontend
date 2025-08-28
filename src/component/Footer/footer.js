/* eslint-disable jsx-a11y/anchor-is-valid */
import { default as React, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../API";
import { show } from "../../utils/Helper";
import ContentModal from "../CommonComponent/ContentModal";

const Footer = () => {
  const [modalShow, setModalShow] = useState(false);
  const [contentUrl, setContentUrl] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState();

  const openModal = (url) => {
    setContentUrl(url);
    setModalShow(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="footerBox">
        <div className="fixed-footer footerclor">
          <div className="container py-2">
            <div className="row">
              <div className="my-3">
                <div className="row justify-content-center">
                  <div className="col-xl-7 col-lg-8 col-sm-12 col-12 text-center">
                    <h5>
                      <strong>MAHARASHTRA STATE BOARD OF NURSING AND PARAMEDICAL EDUCATION</strong>
                    </h5>
                    <p>
                      <b>Directorate of Medical Education & Research, </b>
                      <br />
                      4th Floor, St. George’s Hospital Compound, <br />
                      P. D’Melo Road, Near C.S.M.T.,
                      <br /> Mumbai – 400 001
                    </p>
                    <p className="mb-0">
                      <strong>Contact Us : </strong>
                    </p>
                    <p>
                      Phone: <a href="tel:912222611015">91 22 22611015</a>
                    </p>
                    <p>
                      Email: <a href="mailto:info@msbnpe.org">info@msbnpe.org</a>
                    </p>
                    <div className="text-center">
                      <div className="socialLink mx-auto d-block">
                        <Link to="https://www.facebook.com/" target="_blank">
                          <img src="/assets/images/facebook.svg" alt="Facebook" />
                        </Link>
                        <Link to="https://x.com/" target="_blank">
                          <img src="/assets/images/twitter.svg" alt="twitter" />
                        </Link>
                        <Link to="https://www.youtube.com/" target="_blank">
                          <img src="/assets/images/youtube.svg" alt="youtube" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="counterLink text-center mt-4">
              {visitor !== 0 ? (
                <p className="visitorCount">
                  Visitor Count :&nbsp;{" "}
                  {String(visitor)
                    .split("")
                    .map((char, index) => (
                      <span key={index}>{char}</span>
                    ))}
                </p>
              ) : (
                <p className="visitorCount">
                  Visitor Count :&nbsp; <span>3</span>
                  <span>9</span>
                  <span>9</span>
                </p>
              )}
            </div> */}
            {/* <div className="bottom-text pt-2 pb-3 text-center">
              <span className="text-left">
                Last updated on :&nbsp;
                {lastUpdatedDate ? <Moment format="DD/MM/YY, hh:mm A">{lastUpdatedDate}</Moment> : ""}
              </span>
            </div> */}
          </div>
        </div>
      </div>
      <div className="bg-dark mb-0">
        <div className="container text-center text-dark">
          <p className="py-2 mb-0 font-14 text-white">&copy; Copyright {new Date().getFullYear()} | MSBNPE </p>
        </div>
      </div>
      <ContentModal show={modalShow} handleClose={() => setModalShow(false)} content={contentUrl} />
    </>
  );
};

function AddVisitor() {
  API.post("visitor")
    .then((res) => {})
    .catch((error) => {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    });
}

function GetVisitor(setVisitor) {
  API.get("visitor/count")
    .then((res) => {
      if (res.data.status === "success") {
        setVisitor(res.data.data);
      }
    })
    .catch((error) => {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    });
}

function getLastUpdateDate(setLastUpdatedDate) {
  API.get("lastUpdateDate")
    .then((res) => {
      if (res.data.status === "success") {
        setLastUpdatedDate(res.data.data);
      }
    })
    .catch((error) => {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    });
}

export default Footer;
