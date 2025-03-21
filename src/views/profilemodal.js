import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import helpers from "../helpers/helpers";
import "../css/profilemodal.css";
import VideoComponent from "./customvideo";
import CustomAudioPlayer from "./customaudio";
import FollowButton from "./followbtn";
import { UserContext } from "../UserContext";

const ProfileModal = ({ show, onClose, currentUser, clickedUser }) => {
  const [posts, setPosts] = useState({ audio: [], video: [], text: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);

  const isOwnProfile =
    currentUser && clickedUser && currentUser.username === clickedUser.username;

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

  if (!clickedUser) return null;

  // Container for the header with two columns: image and details
  const headerContainerStyle = {
    display: "flex",
    flexDirection: "row",
  };

  // The image container takes up its own space (fixed width)
  const imageContainerStyle = {
    flex: "0 0 150px", // fixed width for the image column
    objectFit: "cover",
  };

  // The image fills its container
  const imageStyle = {
    width: "100%",
    height: "auto",
    display: "block",
  };

  // Details container for username, follow button, and bio
  const detailsContainerStyle = {
    flex: "1 1 auto",
    textAlign: "left",
  };

  // Style for horizontal post grids
  const horizontalStyle = {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    gap: "10px",
  };

  return (
    <Modal show={show} onHide={onClose} centered className="profile-modal" style={{background:"black"}}>
      <Modal.Header className="p-0">
        <Modal.Title>
          <div className="profile-header" style={headerContainerStyle}>
            <div className="image-container" style={imageContainerStyle}>
              <img
                src={
                  clickedUser.profilePic ||
                  "https://i.ibb.co/d0vr9zHf/defaultpic.jpg"
                }
                alt="Profile"
                style={imageStyle}
              />
            </div>
            <div className="details-container" style={detailsContainerStyle}>
              <span className="profile-username sigmar-regular">
                {clickedUser.username}
              </span>
              <p className="profile-bio">
                {clickedUser.bio || "No bio available."}
              </p>
              <div className="profile-actions">
                {!isOwnProfile && (
                //   <Button className="follow-button">
                //     Follow
                //   </Button>
                <FollowButton currentUser={user ? user.username : ""} clickedUser={clickedUser.username}/>
                )}
                {isOwnProfile && (
                    <Button variant="secondary" className="pm-settings"><i class="fa-solid fa-gear"></i></Button>
                )}
              </div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="spinner">Loading posts...</div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="posts-section">
            {posts.video && posts.video.length > 0 && (
              <div className="posts-group">
                {/* <hr style={{color:"black"}}/> */}
                <h4 className="group-title">Videos</h4>
                <div className="posts-grid" style={horizontalStyle}>
                  {posts.video.map((post) => (
                    <div key={post.postId} className="">
                      <VideoComponent post={post}/>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {posts.audio && posts.audio.length > 0 && (
              <div className="posts-group">
                {/* <hr style={{color:"black"}}/> */}
                <h4 className="group-title">Songs</h4>
                <div className="posts-grid" style={horizontalStyle}>
                  {posts.audio.map((post) => (
                    <div key={post.postId} className="">
                     <CustomAudioPlayer src={post.media} coverPhoto={post.coverPhoto}/>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {posts.text && posts.text.length > 0 && (
              <div className="posts-group">
                {/* <hr style={{color:"black"}}/> */}
                <h4 className="group-title">Conversations</h4>
                <div className="posts-grid" style={horizontalStyle}>
                  {posts.text.map((post) => (
                    <div key={post.postId} className="pm-post-card">
                    <div className="text-post-tags text-start sigmar-regular">
                    {/* {post.primaryTag} */}
                    {post.title.slice(0, 10)}...
                    </div>
                    {post.body.length > 50
                    ? post.body.slice(0, 50) + "..."
                    : post.body}
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


