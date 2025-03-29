import React, { useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { UserContext } from "../UserContext";
import "../css/textpostmodal.css";
import helpers from "../helpers/helpers";

function TextPostModal({ show, onClose, user }) {
  // States for post data
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [postError, setPostError] = useState("");
  

  // Example tag options (only one can be selected)
  const tagOptions = ["Hot Take", "Review", "Question"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation: All fields and a tag must be provided.
    if (!postTitle.trim() || !postBody.trim() || !selectedTag) {
      setPostError("Please fill out all fields and select one tag.");
      return;
    } else if (!user){
        setPostError("Please sign in before creating a post.");
        return;
    }
    setPostError("");

    // TODO: Insert your API call here to create the post
    let obj =  {
        title: postTitle,
        body: postBody,
        primaryTag: selectedTag,
        username: user?.username,
    };

    let result = await helpers.submittextpost(obj);
    if(result.statusCode === 200){
        onClose();
        setPostBody("");
        setPostTitle("");
        setSelectedTag("");
    } else {
        setPostError("Something went wrong.");
        // console.log(result);
        return;
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="textpostmodal text-start">
      <Modal.Header closeButton>
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {postError && (
          <div className="alert alert-danger" role="alert">
            {postError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            {/* <label htmlFor="postTitle" className="form-label">
              Title of post
            </label> */}
            <input
              type="text"
              id="postTitle"
              className="form-control"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Post title here..."
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              id="postBody"
              className="form-control"
              rows="4"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              placeholder="Post content here..."
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Pick a tag that best describes this post
            </label>
            <div>
              {tagOptions.map((tag) => (
                <div className="form-check form-check-inline" key={tag}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tag"
                    id={`tag-${tag}`}
                    value={tag}
                    checked={selectedTag === tag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={`tag-${tag}`}>
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" className="pm-submit-btn">
            Create Post
          </Button>
          <Button variant="secondary" className="ms-2" onClick={onClose}>
            Close
          </Button>
        </form>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
}

export default TextPostModal;

