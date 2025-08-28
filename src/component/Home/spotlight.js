import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React from "react";
import OwlCarousel from "react-owl-carousel";
import { Link } from "react-router-dom";
import HomeCss from "./home.module.css";

const Spotlight = () => {
  const responsiveOptions = {
    0: {
      items: 2,
      margin: 10,
    },
    768: {
      items: 4,
      margin: 20,
    },
    1024: {
      items: 5,
      margin: 20,
    },
    1336: {
      items: 6,
      margin: 20,
    },
    1440: {
      items: 7,
      margin: 20,
    },
  };
  const customNavOptions = {
    loop: true,
    dots: false,
    nav: true,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    autoplay: true,
    autoplayTimeout: 3000,
  };
  return (
    <>
      <div className={HomeCss.spotlight}>
        <OwlCarousel items={3} className="owl-theme spotlightNav" {...customNavOptions} responsive={responsiveOptions}>
          <div className={`item ${HomeCss.box}`}>
            <Link to="https://maharashtra.gov.in/" target="_blank">
              <img className="d-block " src="/assets/images/mahalogo.png" alt="spotlight" />
            </Link>
          </div>
          <div className={`item ${HomeCss.box}`}>
            <Link to="https://htedu.maharashtra.gov.in/Main/" target="_blank">
              <img className="d-block " src="/assets/images/imp2.png" alt="spotlight" />
            </Link>
          </div>
          <div className={`item ${HomeCss.box}`}>
            <Link to="https://aicte-india.org/" target="_blank">
              <img className="d-block " src="/assets/images/imp3.png" alt="spotlight" />
            </Link>
          </div>
          <div className={`item ${HomeCss.box}`}>
            <Link to="https://www.coa.gov.in/" target="_blank">
              <img className="d-block " src="/assets/images/imp4.png" alt="spotlight" />
            </Link>
          </div>
          <div className={`item ${HomeCss.box}`}>
            <Link to="https://msbte.org.in/" target="_blank">
              <img className="d-block " src="/assets/images/msbte.png" alt="spotlight" />
            </Link>
          </div>
          <div className={`item ${HomeCss.box}`}>
            <Link to="https://mahadbtmahait.gov.in/" target="_blank">
              <img className="d-block " src="/assets/images/imp7.png" alt="spotlight" />
            </Link>
          </div>
          <div className={`item ${HomeCss.box}`}>
            <Link to="https://scholarships.gov.in/" target="_blank">
              <img className="d-block " src="/assets/images/imp9.jpg" alt="spotlight" />
            </Link>
          </div>
          <div className={`item ${HomeCss.box}`}>
            <Link to="https://www.pci.nic.in/" target="_blank">
              <img className="d-block " src="/assets/images/imp8.png" alt="spotlight" />
            </Link>
          </div>
          <div className={`item ${HomeCss.box}`}>
            <Link to="https://maha-ara.org/" target="_blank">
              <img className="d-block " src="/assets/images/ARA-logo-FINAL-1.png" alt="spotlight" />
            </Link>
          </div>
        </OwlCarousel>
      </div>
    </>
  );
};

export default Spotlight;
