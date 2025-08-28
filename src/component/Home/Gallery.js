import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";
import HomeCss from "./home.module.css";
import API from "../../API";
import useMasterCategory from "../../utils/useMasterCategory";
import FileComponent from "../CommonComponent/FileVerify";

function Gallery() {
  const [media, setMedia] = useState([]);

  const { categories, selectedCategory, setSelectedCategory } = useMasterCategory("imageCategories");

  useEffect(() => {
    getGallery();
  }, []);

  const getGallery = async () => {
    try {
      const res = await API.get("/gallery/listing");
      if (res?.data?.status === "success") {
        setMedia(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const filteredMedia = selectedCategory === "All" ? media : media.filter((item) => item.category === selectedCategory);

  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h3 className="innercommTitle">Photos Gallery</h3>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="my-3 text-center">
        <div className="col-12">
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
        </div>
      </Container>

      <Container className="my-4">
        <Row className="pt-3 gallery justify-content-center">
          {filteredMedia.length > 0 ? (
            filteredMedia.map((item) => (
              <Col xs={12} sm={6} lg={4} key={item.id} className={`item my-3 ${HomeCss.box}`}>
                <div className="w-100 cPointer card p-2 h-100">
                  {/* <img
                    src={item.image}
                    width="100%"
                    height="300"
                    alt={item.title}
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(item.image);
                      setShowModal(true);
                    }}
                    className="rounded"
                    style={{ objectFit: "cover", cursor: "pointer" }}
                  /> */}
                  <FileComponent file={item.image} fileTitle={item.title} fallbackFile="" fileType="gallery" />
                  <p className="text-center p-1 m-0">{item.title}</p>
                </div>
              </Col>
            ))
          ) : (
            <p className="text-center">No Photos found.</p>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Gallery;
