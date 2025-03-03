import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../css/commentmodal.css";
import helpers from "../helpers/helpers"; // For adding a comment, if needed

function CommentModal({ show, onClose, post }) {
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  // For demonstration, assume post.comments is an array of comment objects
  // Each comment might look like { username: "someone", text: "Nice post!" }
  const comments = post.comments || [];

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      setError("Please enter a comment.");
      return;
    }
    setError("");

    // TODO: Add your API call to post a comment
    // e.g. let result = await helpers.addComment({ postId: post.postId, text: newComment });
    // if (result.statusCode === 200) { ... refresh? or set local state? }

    console.log("Adding comment:", newComment, "to post:", post.postId);

    // Clear the input
    setNewComment("");
    // Optionally close the modal or keep it open
    // onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered className="commentmodal">
      <Modal.Header closeButton>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Display existing comments */}
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((c, index) => (
            <div key={index} className="comment-item">
              <strong className="comment-username">{c.username}</strong>
              <p className="comment-text">{c.text}</p>
            </div>
          ))
        )}

        {/* New Comment Input */}
        <div className="mt-3">
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
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmitComment}>
          Submit Comment
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CommentModal;
