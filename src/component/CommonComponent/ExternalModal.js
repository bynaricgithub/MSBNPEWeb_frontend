import PropTypes from "prop-types";
import React from "react";
import Modal from "react-bootstrap/Modal";

function ExternalModal(props) {
  const { showModal, handleClose, externalLink, message, onAccept, size } = props;

  const handleAccept = () => {
    if (externalLink) {
      window.open(externalLink, "_blank", "noopener,noreferrer");
      handleClose();
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      size={size}
      className="extModal"
      aria-labelledby="external-modal-title"
      aria-describedby="external-modal-description"
    >
      <Modal.Header className="text-center bg-white">
        <Modal.Title id="external-modal-title" className="h5">
          <span>Are you sure you want to continue?</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body id="external-modal-description" className="bg-white">
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer className="text-center d-block bg-white">
        <button className="btn-danger btn" onClick={handleClose}>
          Close
        </button>
        <button
          className="btn btn-primary"
          onClick={handleAccept}
          disabled={!externalLink} // Disable button if no external link
        >
          Go to Website
        </button>
      </Modal.Footer>
    </Modal>
  );
}

// PropTypes for better type safety
ExternalModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  externalLink: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onAccept: PropTypes.func,
  size: PropTypes.string,
};

// Default props
ExternalModal.defaultProps = {
  size: "md",
  externalLink: "",
};

export default ExternalModal;
