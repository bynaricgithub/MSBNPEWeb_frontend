import React, { useEffect } from "react";

function GoogleTranslator() {
  useEffect(() => {
    // Load Google Translate script if not already loaded
    if (!window.google || !window.google.translate) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      // Initialize Google Translate when script is loaded
      window.googleTranslateElementInit = initializeGoogleTranslate;
    } else {
      initializeGoogleTranslate();
    }
  }, []);

  const initializeGoogleTranslate = () => {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en", // Default language
          includedLanguages: "mr,hi,en", // Ordered languages
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    }
  };

  return (
    <div className="google-translate-wrapper" style={{ display: "flex", alignItems: "center" }}>
      {/* Quick Toggle Button */}

      <div id="google_translate_element"></div>
    </div>
  );
}

export default GoogleTranslator;
