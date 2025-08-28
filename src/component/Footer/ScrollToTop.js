import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [showButton, setShowButton] = useState(false);

  // Scroll to the top when the pathname changes (route changes)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Function to handle scroll event and toggle the button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up the event listener
    };
  }, []);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showButton && (
        <button
          className="btn btn-sm btn-primary rounded-circle position-fixed bottom-0 end-0 translate-middle"
          onClick={scrollToTop}
          id="back-to-up"
          style={{ zIndex: 1000 }}
        >
          <i className="fa fa-arrow-up" aria-hidden="true"></i>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
