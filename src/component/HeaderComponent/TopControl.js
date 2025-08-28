import React from "react";
import { Link } from "react-router-dom";
import ThemeAndFontChanger from "./ThemeAndFontChanger";
import GoogleTranslator from "./GoogleTranslator";
import SearchBar from "../Header/search";

function TopControl({ switchTheme }) {
  const scrollToMainContent = (e) => {
    e.preventDefault();

    const mainContent = document.getElementById("main-content");
    const offset = 65;
    const yCoordinate = mainContent.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: yCoordinate,
      behavior: "smooth",
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" id="topBack">
      <div className="container align-items-center justify">
        <ul>
          <li className="m-hide">
            <a href="#main-content" onClick={scrollToMainContent}>
              <b>Skip to main content</b>
            </a>
          </li>
          <li>
            <b>
              Contact Us :&nbsp; <a href="tel:91 022-49183312">+91 022-49183312</a>
              <span>&nbsp; / &nbsp;</span>
              <a href="tel:91 022-49183312">+91 022-49183312</a>
            </b>
          </li>
        </ul>
        <ul>
          <li className="search-box">
            <div className="search mt-0">
              <SearchBar />
            </div>
          </li>
          <li>
            <Link to="/screenread">
              <i className="fa fa-volume-up" title="Screen Reader"></i>
            </Link>
          </li>

          <li>
            <Link to="/sitemap">
              <i className="fa fa-sitemap" title="Sitemap"></i>
            </Link>
          </li>
          {/* <li>
            <GoogleTranslator />
          </li> */}
          <ThemeAndFontChanger switchTheme={switchTheme} />
        </ul>
      </div>
    </nav>
  );
}

export default TopControl;
