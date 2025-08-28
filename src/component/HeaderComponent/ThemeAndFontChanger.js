import React from "react";

function ThemeAndFontChanger({ switchTheme }) {
  const s3Path = process.env.REACT_APP_S3_PATH;

  const fontSizeIncrement = 2; // Fixed increment value for font size changes

  const resizeText = (increment) => {
    const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, font, li, a, b, th, td, button i");

    elements.forEach((element) => {
      let elementFontSize = parseFloat(window.getComputedStyle(element).fontSize);
      element.style.fontSize = elementFontSize + increment + "px";
    });
  };

  const resetFontSize = () => {
    const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, font, li, a, b, th, td, button i");

    elements.forEach((element) => {
      element.style.fontSize = "";
    });
  };

  return (
    <>
      <li>
        <div className="d-flex align-items-center">
          <div className="theme-controls d-flex justify-content-center">
            <img
              src={"/assets/images/black.png"}
              onClick={() => switchTheme("dark-theme")}
              alt="Dark Theme"
              className="img-fluid themeColor mx-1"
              title="Dark Theme"
            />

            <img
              src={"/assets/images/navy.png"}
              onClick={() => switchTheme("blue-theme")}
              alt="Blue Theme"
              className="img-fluid themeColor mx-1"
              title="Blue Theme"
            />
          </div>
        </div>
      </li>

      <li>
        <div className="d-flex align-items-center">
          <div className="theme-controls d-flex  justify-content-center">
            <i onClick={() => resizeText(fontSizeIncrement)} className="fa fa-plus mx-1" title="Increase Font Size"></i>
            <i onClick={resetFontSize} className="fa mx-1" title="Reset Font Size">
              =
            </i>
            <i onClick={() => resizeText(-fontSizeIncrement)} className="fa fa-minus mx-1" title="Decrease Font Size"></i>
          </div>
        </div>
      </li>
    </>
  );
}

export default ThemeAndFontChanger;
