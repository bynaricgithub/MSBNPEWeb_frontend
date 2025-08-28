import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;

  const handleSearch = async () => {
    if (query.trim() !== "") {
      navigate(`/search?query=${query}`);
    }
  };

  const startVoiceSearch = () => {
    recognition.start();
  };

  recognition.onresult = (event) => {
    const voiceQuery = event.results[0][0].transcript;
    setQuery(voiceQuery);
    navigate(`/search?query=${voiceQuery}`);
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control custom-translate"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <div className="input-group-append d-flex">
        <span className="input-group-text" id="basic-addon2" onClick={handleSearch} style={{ borderRadius: "0" }}>
          <i className="fa fa-search fa-flip-horizontal" aria-hidden="true"></i>
        </span>

        <span className="input-group-text bg-warning" id="mic-addon" onClick={startVoiceSearch}>
          <i className="fa fa-microphone" aria-hidden="true"></i>
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
