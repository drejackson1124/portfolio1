import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../css/surverymodal.css";

function SurveyModal({ show, onClose, post }) {
  // States for the three rating categories
  const [styleRating, setStyleRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [originalityRating, setOriginalityRating] = useState(0);

  const renderStars = (rating, setRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={i <= rating ? "fas fa-star" : "far fa-star"}
          style={{ cursor: "pointer", color: "#ffcc00", marginRight: "5px" }}
          onClick={() => {
            console.log("Star clicked:", i);
            setRating(i);
          }}
        ></i>
      );
    }
    return stars;
  };
  

  const handleSubmit = () => {
    // Gather ratings along with the post's ID
    const ratings = {
      postId: post.postId, // Ensure your post object has a unique identifier
      style: styleRating,
      delivery: deliveryRating,
      originality: originalityRating,
    };
    console.log("Submitting ratings:", ratings);
    // TODO: Insert your API call here to submit the ratings.
    onClose(); // Close the modal after submission
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rate this Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {post && (
          <>
            <p><strong>Style:</strong></p>
            {renderStars(styleRating, setStyleRating)}
            <p className="mt-3"><strong>Delivery:</strong></p>
            {renderStars(deliveryRating, setDeliveryRating)}
            <p className="mt-3"><strong>Originality:</strong></p>
            {renderStars(originalityRating, setOriginalityRating)}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit Ratings
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SurveyModal;

