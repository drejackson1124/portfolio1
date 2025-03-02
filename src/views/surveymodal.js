// import React, { useState, useContext } from "react";
// import { Modal, Button, Spinner } from "react-bootstrap";
// import { UserContext } from "../UserContext";
// import { useNavigate } from "react-router-dom";
// import "../css/surverymodal.css";
// import helpers from "../helpers/helpers";

// function SurveyModal({ show, onClose, post }) {
//   // States for the three rating categories
//   const [styleRating, setStyleRating] = useState(0);
//   const [deliveryRating, setDeliveryRating] = useState(0);
//   const [originalityRating, setOriginalityRating] = useState(0);
//   const [showSpinner, setShowSpinner] = useState(false);
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();

//   const renderStars = (rating, setRating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <i
//           key={i}
//           className={i <= rating ? "fa-solid fa-star" : "fa-regular fa-star"}
//           style={{ cursor: "pointer", color: "#ffcc00", marginRight: "5px" }}
//           onClick={() => {
//             setRating(i);
//           }}
//         ></i>
//       );
//     }
//     return stars;
//   };
  

//   const handleSubmit = async () => {

//     let username = null;
//     if(user !== null){
//       username = user.username;
//     }
//     // Gather ratings along with the post's ID
//     const ratings = {
//       postId: post.postId, // Ensure your post object has a unique identifier
//       style: styleRating,
//       delivery: deliveryRating,
//       originality: originalityRating,
//       user_voting: username
//     };

//     if(!ratings.user_voting){
//       alert('Please sign in or create an account to give feedback.');
//     } else if(!styleRating || !deliveryRating || !originalityRating){
//       alert('Please leave a rating for each category.');
//     } else {
//       setShowSpinner(true);
//       let result = await callBE(ratings);

//       setShowSpinner(false);
//       if(result.statusCode === 200){
//         console.log(result);
//         navigate("/");
//       } else {
//         console.log(result);
//       }
//     }

//     onClose(); // Close the modal after submission
//   };

//   const callBE = async (ratingsObj) => {
//     let result = await helpers.submitrating(ratingsObj);
//     return result;
//   }

//   if(showSpinner){
//     return <Spinner/>
//   }

//   return (
//     <Modal show={show} onHide={onClose} centered className="surveymodal">
//       <Modal.Header closeButton>
//         <Modal.Title>Rate this Post</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {post && (
//           <>
//             <p><strong>Style:</strong></p>
//             {renderStars(styleRating, setStyleRating)}
//             <p className="mt-3"><strong>Delivery:</strong></p>
//             {renderStars(deliveryRating, setDeliveryRating)}
//             <p className="mt-3"><strong>Originality:</strong></p>
//             {renderStars(originalityRating, setOriginalityRating)}
//           </>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button className="surveymodal-cbtn" onClick={onClose}>
//           Cancel
//         </Button>
//         <Button className="surveymodal-sbtn" onClick={handleSubmit}>
//           Submit Ratings
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// export default SurveyModal;

import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import "../css/surverymodal.css";
import helpers from "../helpers/helpers";

function SurveyModal({ show, onClose, post }) {
  // States for the three rating categories
  const [styleRating, setStyleRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [originalityRating, setOriginalityRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const renderStars = (rating, setRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={i <= rating ? "fa-solid fa-star" : "fa-regular fa-star"}
          style={{ cursor: "pointer", color: "#ffcc00", marginRight: "5px" }}
          onClick={() => setRating(i)}
        ></i>
      );
    }
    return stars;
  };

  const handleSubmit = async () => {
    // Assume the username is available from the post object (or elsewhere)
    const username = post && post.username;
    const ratings = {
      postId: post.postId,
      style: styleRating,
      delivery: deliveryRating,
      originality: originalityRating,
      user_voting: username,
    };

    if (!username) {
      alert("Please sign in or create an account to give feedback.");
      return;
    }
    if (!styleRating || !deliveryRating || !originalityRating) {
      alert("Please leave a rating for each category.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      let result = await callBE(ratings);
      setLoading(false);
      if (result.statusCode === 200) {
        onClose(); // Close modal on success (navigate if needed)
      } else {
        setErrorMsg("An error occurred. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg("An unexpected error occurred.");
    }
  };

  const callBE = async (ratingsObj) => {
    let result = await helpers.submitrating(ratingsObj);
    return result;
  };

  return (
    <Modal show={show} onHide={onClose} centered className="surveymodal">
      <Modal.Header closeButton>
        <Modal.Title>Rate this Post</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ position: "relative" }}>
        {errorMsg && (
          <div className="alert alert-danger">{errorMsg}</div>
        )}
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
        {loading && (
          <div className="spinner-overlay">
            <Spinner animation="border" variant="light" />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="surveymodal-cbtn" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button className="surveymodal-sbtn" onClick={handleSubmit} disabled={loading}>
          Submit Ratings
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SurveyModal;


