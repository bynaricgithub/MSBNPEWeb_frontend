import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import API from "../../API";
import { show } from "../../utils/Helper";

const NewsUpdate = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);

  const calculatedWidth = width < 600 ? "350px" : "1200px";

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchLatestUpdates();
  }, []);

  const fetchLatestUpdates = async () => {
    try {
      const res = await API.get("/latest-update/listing");
      setData(res.data?.data || []);
    } catch (error) {
      show({
        message: error?.response?.data?.message || error?.message || "Error fetching latest updates",
        displayClass: "failure",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePause = () => setIsPlaying(false);
  const handlePlay = () => setIsPlaying(true);

  const isPDF = (url) => url?.toLowerCase().includes(".pdf");

  return (
    <div>
      <div className="latestUpdate">
        <div className="wrap container">
          <div className="newsMarquee">
            <div className="title">
              <h6>LATEST UPDATES</h6>
            </div>
            <div className="news">
              {!loading && (
                <Marquee pauseOnHover play={isPlaying} speed={60} gradient={false} className="news-content px-6">
                  <b style={{ width: calculatedWidth, display: "block" }}>&nbsp;</b>
                  {data.map((record, index) => (
                    <b className="marqueeFont" key={index}>
                      {isPDF(record.link) ? (
                        <span
                          onClick={() => {
                            setFile(record.link.includes("http") ? record.link : process.env.REACT_APP_DATA_SERVER_PATH + record.link);
                            setShowModal(true);
                          }}
                          dangerouslySetInnerHTML={{ __html: record.title }}
                          className="cPointer"
                        ></span>
                      ) : (
                        <a href={record.link} target="_blank" rel="noreferrer" dangerouslySetInnerHTML={{ __html: record.title }}></a>
                      )}
                      {index !== data.length - 1 && <span className="mx-2 text-dark">|</span>}
                    </b>
                  ))}
                </Marquee>
              )}
              <div className="d-flex">
                <button className="btn btn-sm btn-warning" onClick={handlePause}>
                  <i className="fa fa-pause" aria-hidden="true"></i>
                </button>
                <button className="btn btn-sm btn-warning" onClick={handlePlay}>
                  <i className="fa fa-play" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsUpdate;
