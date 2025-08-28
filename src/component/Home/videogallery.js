import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OwlCarousel from "react-owl-carousel";
import HomeCss from "./home.module.css";
import API from "../../API";

function Videogallery() {
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getVideoGallery();
  }, []);

  const extractYouTubeId = (url) => {
    try {
      const urlObj = new URL(url);
      const id = urlObj.searchParams.get("v");
      return id || url.split("/").pop();
    } catch {
      return url; // fallback to assuming it's already a YouTube ID
    }
  };

  const getVideoGallery = async () => {
    try {
      const res = await API.get("/video-gallery/listing");
      if (res?.data?.status === "success" && Array.isArray(res.data.data)) {
        const lastSix = res.data.data.reverse().map((item) => ({
          id: item.id,
          title: item.title,
          youtubeId: extractYouTubeId(item.file),
        }));
        setVideos(lastSix);
      } else {
        setVideos([]); // no fallback
      }
    } catch (error) {
      console.error("API error:", error);
      setVideos([]);
    }
  };

  const handleShowModal = (youtubeId) => {
    if (youtubeId) {
      setSelectedVideoId(youtubeId);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedVideoId(null);
    setShowModal(false);
  };

  const responsiveOptions = {
    0: { items: 1, margin: 10 },
    576: { items: 2, margin: 15 },
    768: { items: 3, margin: 20 },
    1024: { items: 3, margin: 25 },
    1336: { items: 4, margin: 30 },
  };

  const carouselOptions = {
    loop: true,
    dots: false,
    nav: true,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: responsiveOptions,
  };

  return (
    <>
      <div className="border-0">
        <div>
          {videos.length > 0 ? (
            <OwlCarousel className="owl-theme newsEvents" {...carouselOptions}>
              {videos.map((item) => (
                <div key={item.id} className={`item ${HomeCss.box}`}>
                  <div className="w-100 cPointer card p-2">
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                      width="100%"
                      height="300"
                      alt={item.title}
                      onClick={() => handleShowModal(item.youtubeId)}
                      className="rounded"
                      style={{ objectFit: "cover", cursor: "pointer" }}
                    />
                    <p className="text-center p-1 m-0">{item.title}</p>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          ) : (
            <p className="text-center">No videos found.</p>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Video Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVideoId ? (
            <div className="ratio ratio-16x9">
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p className="text-center text-danger">Video unavailable.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Videogallery;
