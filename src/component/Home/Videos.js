import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Col, Container, Row } from "react-bootstrap";
import HomeCss from "./home.module.css";
import API from "../../API";
import useMasterCategory from "../../utils/useMasterCategory";

function Videos() {
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { categories, selectedCategory, setSelectedCategory } = useMasterCategory("videoCategories");

  useEffect(() => {
    getVideoGallery();
  }, []);

  const extractYouTubeId = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v") || url.split("/").pop();
    } catch {
      return url;
    }
  };

  const getVideoGallery = async () => {
    try {
      const res = await API.get("/video-gallery/listing");
      if (res?.data?.status === "success") {
        const data = res.data.data.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          youtubeId: extractYouTubeId(item.file),
        }));
        setVideos(data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const filteredVideos = selectedCategory === "" ? videos : videos.filter((vid) => vid.category === selectedCategory);

  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h3 className="innercommTitle">Videos Gallery</h3>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="my-3 text-center">
        {categories.map((cat, idx) => (
          <Button
            className="mx-1 mt-4 px-4"
            key={idx}
            variant={selectedCategory === cat.value ? "danger" : "primary"}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </Container>

      <Container className="my-4">
        <Row className="pt-3 gallery justify-content-center">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((item) => (
              <Col xs={12} sm={6} lg={4} key={item.id} className={`item my-3 ${HomeCss.box}`}>
                <div className="w-100 cPointer card p-2 h-100">
                  <img
                    src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                    width="100%"
                    height="300"
                    alt={item.title}
                    onClick={() => {
                      setSelectedVideoId(item.youtubeId);
                      setShowModal(true);
                    }}
                    className="rounded"
                    style={{ objectFit: "cover", cursor: "pointer" }}
                  />
                  <p className="text-center p-1 m-0">{item.title}</p>
                </div>
              </Col>
            ))
          ) : (
            <p className="text-center">No videos found.</p>
          )}
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
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
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p>
              Video unavailable.{" "}
              <a href={`https://www.youtube.com/watch?v=${selectedVideoId}`} target="_blank" rel="noreferrer">
                Watch on YouTube
              </a>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Videos;
