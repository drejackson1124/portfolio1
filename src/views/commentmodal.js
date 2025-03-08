// import React, { useState, useContext } from "react";
// import { Modal, Button } from "react-bootstrap";
// import "../css/commentmodal.css";
// import helpers from "../helpers/helpers";
// import { UserContext } from "../UserContext";
// import { Link } from "react-router-dom";

// function CommentModal({ show, onClose, post }) {
//   const [newComment, setNewComment] = useState("");
//   const [error, setError] = useState("");
//   const { user } = useContext(UserContext);

//   const comments = post.comments || [];
//   const isUserLoggedIn = user && user.username; // true if user is signed in

//   const handleSubmitComment = async () => {
//     if (!newComment.trim()) {
//       setError("Please enter a comment.");
//       return;
//     }
//     setError("");

//     if (!isUserLoggedIn) {
//       setError("You must be signed in to comment.");
//       return;
//     }

//     console.log("Adding comment:", newComment, "to post:", post.postId);
//     let result = await helpers.createcomment({
//       postId: post.postId,
//       message: newComment,
//       user: user.username,
//     });

//     // Clear the input (you could also update local comments state if needed)
//     setNewComment("");
//   };

//   return (
//     <Modal show={show} onHide={onClose} centered className="commentmodal">
//       <Modal.Header closeButton>
//         <Modal.Title>{post.body} - <span className="commentbox-username pink">{post.username}</span></Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {error && <div className="alert alert-danger">{error}</div>}

//         {/* Display existing comments */}
//         {comments.length === 0 ? (
//           <p>No comments yet. Be the first to comment!</p>
//         ) : (
//           comments.map((c, index) => (
//             <div key={index} className="comment-item">
//               <strong className="comment-username">{c.username}</strong>
//               <p className="comment-text"><span className="comments-posts-username pink">{c.user}:</span> {c.message}</p>
//             </div>
//           ))
//         )}

//         {/* New Comment Input */}
//         <div className="mt-3">
//           {isUserLoggedIn ? (
//             <>
//               <label htmlFor="newComment" className="form-label">
//                 Add a Comment
//               </label>
//               <textarea
//                 id="newComment"
//                 className="form-control"
//                 rows="3"
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//               ></textarea>
//             </>
//           ) : (
//             <Link to="/signin" className="dodgerblue">Please sign in to leave a comment.</Link>
//           )}
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onClose}>
//           Close
//         </Button>
//         {isUserLoggedIn && (
//           <Button variant="primary" onClick={handleSubmitComment}>
//             Submit Comment
//           </Button>
//         )}
//       </Modal.Footer>
//     </Modal>
//   );
// }

// export default CommentModal;

import React, { useState, useContext, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../css/commentmodal.css";
import helpers from "../helpers/helpers";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

function CommentModal({ show, onClose, post, onCommentAdded }) {
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);

  // Local state for comments so that we can update the thread instantly.
  const [localComments, setLocalComments] = useState(post.comments || []);

  useEffect(() => {
    // Update local state if the post prop changes
    setLocalComments(post.comments || []);
  }, [post]);

  const isUserLoggedIn = user && user.username;
  // console.log(post);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      setError("Please enter a comment.");
      return;
    }
    setError("");

    if (!isUserLoggedIn) {
      setError("You must be signed in to comment.");
      return;
    }

    let result = await helpers.createcomment({
      postId: post.postId,
      message: newComment,
      user: user.username,
    });

    if (result.statusCode === 200) {
      // Create a new comment object with a current timestamp.
      const newCommentObj = {
        user: user.username,
        message: newComment,
        timestamp: Date.now(), // current timestamp in milliseconds
      };

      // Update the local comments state in the modal
      setLocalComments((prevComments) => [...prevComments, newCommentObj]);

      // Propagate the new comment up to the parent so the post's comment count updates.
      if (onCommentAdded) {
        onCommentAdded(post.postId, newCommentObj);
      }

      // Clear the input field.
      setNewComment("");
    } else {
      setError("Error submitting comment. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="commentmodal">
      <Modal.Header closeButton>
        <Modal.Title>
          {post.body} - <span className="commentbox-username dodgerblue">{post.username}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Display existing comments */}
        <div className="discussion-comments">
          {localComments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            localComments.map((c, index) => (
              <div key={index} className="comment-item">
                <p className="comment-text comments-posts-username white">
                  <span className="pink">{c.user}:</span> {c.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* New Comment Input */}
        <div className="mt-3">
          {isUserLoggedIn ? (
            <>
              <label htmlFor="newComment" className="form-label">
                Add a Comment
              </label>
              <textarea
                id="newComment"
                className="form-control"
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
            </>
          ) : (
            <Link to="/signin" className="dodgerblue">
              Please sign in to leave a comment.
            </Link>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {isUserLoggedIn && (
          <Button variant="primary" onClick={handleSubmitComment}>
            Submit Comment
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default CommentModal;


