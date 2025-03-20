import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import helpers from "../helpers/helpers";
import "../css/profilemodal.css";

const ProfileModal = ({ show, onClose, currentUser, clickedUser }) => {
  // Always call hooks at the top
  const [posts, setPosts] = useState({ audio: [], video: [], text: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Determine if the profile being viewed belongs to the current user.
  const isOwnProfile =
    currentUser && clickedUser && currentUser.username === clickedUser.username;

  // Use a safe check in the dependency array
  useEffect(() => {
    if (show && clickedUser && clickedUser.username) {
      const fetchUserPosts = async () => {
        try {
          const response = await helpers.getuserposts({
            username: clickedUser.username,
          });
          const data =
            typeof response.body === "string"
              ? JSON.parse(response.body)
              : response.body;
          setPosts(data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching user posts:", err);
          setError("Error fetching user posts.");
          setLoading(false);
        }
      };
      fetchUserPosts();
    }
  }, [show, clickedUser]);

  // Early return if no clickedUser is provided.
  if (!clickedUser) return null;

  return (
    <Modal show={show} onHide={onClose} centered className="profile-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="profile-header">
            <img
              src={
                clickedUser.profilePic ||
                "https://i.ibb.co/0p1LWbB1/defaultpic.jpg"
              }
              alt="Profile"
              className="profile-pic rounded-circle"
            />
            <span className="profile-username">@{clickedUser.username}</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="profile-bio text-center">
          <p>{clickedUser.bio || "No bio available."}</p>
        </div>
        {/* Only show follow button if viewing someone else's profile */}
        {!isOwnProfile && (
          <div className="follow-btn-container text-center">
            <Button variant="primary">Follow</Button>
          </div>
        )}
        {loading ? (
          <div className="spinner">Loading posts...</div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="posts-section">
            {posts.video && posts.video.length > 0 && (
              <div className="posts-group">
                <h4 className="group-title">Videos</h4>
                <div className="posts-grid">
                  {posts.video.map((post) => (
                    <div key={post.postId} className="post-card">
                      <video controls className="post-video w-100">
                        <source src={post.media} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {posts.audio && posts.audio.length > 0 && (
              <div className="posts-group">
                <h4 className="group-title">Songs</h4>
                <div className="posts-grid">
                  {posts.audio.map((post) => (
                    <div key={post.postId} className="post-card">
                      <img
                        src={post.coverPhoto}
                        alt="Cover"
                        className="post-cover w-100"
                      />
                      <audio controls className="post-audio w-100">
                        <source src={post.media} type="audio/mp3" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {posts.text && posts.text.length > 0 && (
              <div className="posts-group">
                <h4 className="group-title">Conversations</h4>
                <div className="posts-grid">
                  {posts.text.map((post) => (
                    <div key={post.postId} className="post-card">
                      <p className="post-text">{post.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileModal;
