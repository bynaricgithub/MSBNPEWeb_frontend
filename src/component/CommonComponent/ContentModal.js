import React, { useState } from "react";
import { Button, ButtonGroup, Modal } from "react-bootstrap";

const ContentModal = ({ show, handleClose, content }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pdfScale, setPdfScale] = useState(1);
  const isPdf = content?.endsWith("pdf") || content?.includes("pdf");

  if (isPdf && window.innerWidth < 600) {
    window.open(content, "_blank");
    handleClose();
    return null;
  }

  const handleZoomIn = () => {
    setPdfScale((prevZoom) => Math.min(prevZoom + 0.2, 2)); // Max zoom level 2x
  };

  const handleZoomOut = () => {
    setPdfScale((prevZoom) => Math.max(prevZoom - 0.2, 0.6)); // Min zoom level 0.6x
  };

  const handleResetZoom = () => {
    setPdfScale(1); // Reset to original size
  };

  const displayContent = isPdf ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto", // Allow scrolling for zoomed content
      }}
    >
      <iframe
        src={content}
        title="PDF"
        style={{
          width: "100%",
          height: "100vh", // Ensure full height
          transform: `scale(${pdfScale})`,
          transformOrigin: "center", // Center the scaling
        }}
      />
    </div>
  ) : (
    <img
      src={content}
      alt="Content"
      className="d-block m-auto img-fluid"
      style={{
        width: "auto",
        height: "72vh", // Ensure full height
        transform: `scale(${pdfScale})`,
        transformOrigin: "center", // Center the scaling
      }}
    />
  );

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="customModalDialog" contentClassName="customModal" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <h5>Preview</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="customModalBody">
        <div style={{ overflow: "auto" }}>{displayContent}</div>
      </Modal.Body>
      {!isPdf && (
        <Modal.Footer className="d-flex justify-content-center">
          <ButtonGroup aria-label="Zoom controls">
            <Button variant="primary">Zoom</Button>
            <Button variant="outline-primary" onClick={handleZoomOut}>
              &#x2212;
            </Button>
            <Button variant="outline-primary" onClick={handleZoomIn}>
              &#x2b;
            </Button>
            <Button variant="outline-primary" onClick={handleResetZoom}>
              &#x21bb;
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ContentModal;
