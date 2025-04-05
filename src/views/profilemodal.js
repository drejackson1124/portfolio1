import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import helpers from "../helpers/helpers";
import "../css/profilemodal.css";
import VideoComponent from "./customvideo";
import CustomAudioPlayer from "./customaudio";
import FollowButton from "./followbtn";
import { UserContext } from "../UserContext";
import FullPageSpinner from "./spinner";
import CommentModal from "./commentmodal";

const ProfileModal = ({ show, onClose, currentUser, clickedUser }) => {
  const [posts, setPosts] = useState({ audio: [], video: [], text: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useContext(UserContext);

  const isOwnProfile =
    currentUser &&
    clickedUser &&
    currentUser.username === clickedUser.username;

  // State for editing bio.
  const [showEditModal, setShowEditModal] = useState(false);
  const [localBio, setLocalBio] = useState(clickedUser ? clickedUser.bio : "");
  const [bioText, setBioText] = useState("");

  // State for profile image.
  const [localProfilePic, setLocalProfilePic] = useState(
    clickedUser ? clickedUser.profilePic : ""
  );
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  // Update localBio and localProfilePic when clickedUser changes.
  useEffect(() => {
    if (clickedUser) {
      setLocalBio(clickedUser.bio);
      setLocalProfilePic(clickedUser.profilepic);
    }
  }, [clickedUser]);

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

  // Styles.
  const headerContainerStyle = {
    display: "flex",
    flexDirection: "row",
  };

  const imageContainerStyle = {
    flex: "0 0 150px",
    objectFit: "cover",
    cursor: isOwnProfile ? "pointer" : "default",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    display: "block",
  };

  const detailsContainerStyle = {
    flex: "1 1 auto",
    textAlign: "left",
    position: "relative",
    paddingRight: "40px",
  };

  const horizontalStyle = {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    gap: "10px",
  };

  const gearIconStyle = {
    position: "absolute",
    top: "5px",
    right: "5px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "1.2rem",
    color: "#333",
  };

  // Bio modal handlers.
  const handleOpenEditModal = () => {
    setBioText(localBio || "");
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleBioChange = (e) => {
    setBioText(e.target.value);
  };

  const handleSubmitBio = async () => {
    try {
      const response = await helpers.updatebio({
        username: user.username,
        bio: bioText,
      });
      if (response.statusCode === 200) {
        setLocalBio(bioText);
        setShowEditModal(false);
      } else {
        console.error("Failed to update bio:", response);
      }
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  // Image upload handlers.
  const handleImageClick = () => {
    if (isOwnProfile) {
      setShowImageUploadModal(true);
      setImageUploadError("");
      setImageFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        setImageUploadError("Only JPEG or PNG images are allowed.");
        return;
      }
      setImageFile(file);
      setImageUploadError("");
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      setImageUploadError("Please select an image to upload.");
      return;
    }
    setUploadingImage(true);
    setImageUploadError("");
    try {
      // Generate a filename; you can use Date.now() or a timestamp.
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
      const imageFilename = `${user.username}_${timestamp}_${imageFile.name}`;
      // Get presigned URL.
      const presignedResult = await helpers.uploadfile({
        filename: imageFilename,
        username: user.username,
        content_type: imageFile.type,
      });
      if (!presignedResult || presignedResult.statusCode !== 200) {
        setImageUploadError("Error obtaining upload URL for image.");
        setUploadingImage(false);
        return;
      }
      const { upload_url, s3_url } = JSON.parse(presignedResult.body);
      // Upload image to S3.
      const uploadResponse = await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": imageFile.type,
        },
        body: imageFile,
      });
      if (!uploadResponse.ok) {
        setImageUploadError("Error uploading image to S3.");
        setUploadingImage(false);
        return;
      }
      // Update local profile picture.
      await helpers.updateprofilepic({username: user.username, s3_url: s3_url});
      setLocalProfilePic(s3_url);
      setShowImageUploadModal(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageUploadError("Error uploading image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPost(null);
  };

  // Callback to update posts state when a comment is added.
  const handleCommentAdded = (postId, newCommentObj) => {
    setPosts((prevPosts) => ({
      ...prevPosts,
      text: prevPosts.text.map((post) =>
        post.postId === postId
          ? { ...post, comments: [...(post.comments || []), newCommentObj] }
          : post
      )
    }));
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered className="profile-modal">
        <Modal.Header className="p-0" style={{borderBottom:"none"}}>
          <Modal.Title>
            <div className="profile-header" style={headerContainerStyle}>
              <div
                className="image-container"
                style={imageContainerStyle}
                onClick={handleImageClick}
              >
                <img
                  src={
                    localProfilePic ||
                    "https://i.ibb.co/d0vr9zHf/defaultpic.jpg"
                  }
                  alt="Profile"
                  style={imageStyle}
                />
              </div>
              <div className="details-container" style={detailsContainerStyle}>
                <span className="profile-username sigmar-regular">
                  {clickedUser.username.slice(0,10)}
                </span>
                <p className="profile-bio">
                  {localBio || "No bio available."}
                </p>
                <div className="profile-actions">
                  {!isOwnProfile && (
                    <FollowButton
                      currentUser={user ? user.username : ""}
                      clickedUser={clickedUser.username}
                    />
                  )}
                  {isOwnProfile && (
                    <Button
                      variant="secondary"
                      className="pm-settings"
                      onClick={handleOpenEditModal}
                    >
                      <i className="fa-solid fa-gear"></i> Update Bio
                    </Button>
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
          ) : posts.video.length === 0 &&
            posts.audio.length === 0 &&
            posts.text.length === 0 ? (
            <p className="pm-noposts white">No posts to display.</p>
          ) : (
            <div className="posts-section">
              {posts.video && posts.video.length > 0 && (
                <div className="posts-group">
                  <h4 className="group-title">Videos</h4>
                  <div className="posts-grid" style={horizontalStyle}>
                    {posts.video.map((post) => (
                      <div key={post.postId}>
                        <VideoComponent post={post} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {posts.audio && posts.audio.length > 0 && (
                <div className="posts-group">
                  <h4 className="group-title">Songs</h4>
                  <div className="posts-grid" style={horizontalStyle}>
                    {posts.audio.map((post) => (
                      <div key={post.postId}>
                        <CustomAudioPlayer
                          src={post.media}
                          coverPhoto={post.coverPhoto}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {posts.text && posts.text.length > 0 && (
                <div className="posts-group">
                  <h4 className="group-title">Conversations</h4>
                  <div className="posts-grid" style={horizontalStyle}>
                    {posts.text.map((post) => (
                      <div key={post.postId} className="pm-post-card" onClick={() => { openCommentModal(post) }}>
                        <div className="chat-bubble">
                          {post.comments ? post.comments.length + " talkin'": ""}
                        </div>
                        <div className="text-post-tags text-start sigmar-regular">
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
          <Button className="pm-close-btn" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {showCommentModal && selectedPost && (
        <CommentModal
          show={showCommentModal}
          onClose={closeCommentModal}
          post={selectedPost}
          onCommentAdded={handleCommentAdded}
        />
      )}

      {/* Edit Bio Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Bio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={bioText}
            onChange={handleBioChange}
            className="form-control"
            placeholder="Enter new bio"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitBio}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Upload Modal */}
      <Modal
        show={showImageUploadModal}
        onHide={() => setShowImageUploadModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploadingImage ? (
            <FullPageSpinner />
          ) : (
            <>
              {imageUploadError && <p className="error">{imageUploadError}</p>}
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowImageUploadModal(false)}
          >
            Cancel
          </Button>
          {!uploadingImage && (
            <Button variant="primary" onClick={handleUploadImage}>
              Upload
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileModal;


