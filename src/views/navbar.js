import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext"; // Adjust path as needed
import helpers from "../helpers/helpers";
import moment from "moment";
import TextPostModal from "./postmodal";

function Navbar() {
  const { user } = useContext(UserContext);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPostsModal, setShowPostsModal] = useState(false);
  const [postError, setPostError] = useState("");
  const [showTextPostModal, setShowTextPostModal] = useState(false);
  
  // Post form state
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const tagOptions = ["Rap", "RnB", "Rock", "Soul", "Country", "New", "Oldie but Goodie", "Chill Vibes", "Get Turnt", "Sensual"];
  
  const tooltipRef = useRef(null);
  const defaultProfilePic = "https://i.ibb.co/0p1LWbB1/defaultpic.jpg";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  const openProfileModal = () => {
    setShowProfileModal(true);
    setShowTooltip(false);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const openPostsModal = () => {
    setShowPostsModal(true);
    setShowTooltip(false);
  };

  const closePostsModal = () => {
    setShowPostsModal(false);
    // Reset post form fields
    setPostTitle("");
    setPostBody("");
    setSelectedTags([]);
    setMediaFile(null);
    setCoverPhotoFile(null);
    setPostError("");
  };

  const handleMediaFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
  };

  // New handler for cover photo file
  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverPhotoFile(file);
  };

  const handleTagChange = (e) => {
    const tag = e.target.value;
    if (e.target.checked) {
      setSelectedTags((prev) => [...prev, tag]);
    } else {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!postTitle.trim() || !mediaFile || !postBody.trim() || selectedTags.length === 0) {
      setPostError("Please fill out all fields and pick at least one tag.");
      return;
    }
    
    // If the media is audio, ensure a cover photo is also provided.
    let contentType = mediaFile.type;
    if (contentType === "audio/mp3") {
      contentType = "audio/mpeg";
    }
    if (contentType.startsWith("audio/") && !coverPhotoFile) {
      setPostError("For audio posts, please upload a cover photo.");
      return;
    }
    
    setPostError("");
    
    // Generate a filename for the media file
    const timestamp = moment().format("YYYYMMDD_HHmmss");
    const mediaFilename = `${user.username}_${timestamp}_${mediaFile.name}`;
    
    // Step 1: Get the presigned URL for the main media file
    let presignedResult = await helpers.uploadfile({
      filename: mediaFilename,
      username: user.username,
      content_type: contentType // Use the file's MIME type
    });
    
    if (!presignedResult || presignedResult.statusCode !== 200) {
      setPostError("Error obtaining upload URL for media.");
      return;
    }
    
    const { upload_url, s3_url } = JSON.parse(presignedResult.body);
    
    // Step 2: Upload the main media file directly to S3 using the presigned URL.
    const uploadResponse = await fetch(upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: mediaFile,
    });
    
    if (!uploadResponse.ok) {
      setPostError("Error uploading media file to S3.");
      return;
    }
    
    // If audio, get a presigned URL for the cover photo
    let cover_s3_url = "";
    if (contentType.startsWith("audio/")) {
      const coverFilename = `${user.username}_${timestamp}_cover_${coverPhotoFile.name}`;
      let coverPresignedResult = await helpers.uploadfile({
        filename: coverFilename,
        username: user.username,
        content_type: coverPhotoFile.type
      });
      
      if (!coverPresignedResult || coverPresignedResult.statusCode !== 200) {
        setPostError("Error obtaining upload URL for cover photo.");
        return;
      }
      
      const { upload_url: cover_upload_url, s3_url: cover_url } = JSON.parse(coverPresignedResult.body);
      
      const coverUploadResponse = await fetch(cover_upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": coverPhotoFile.type,
        },
        body: coverPhotoFile,
      });
      
      if (!coverUploadResponse.ok) {
        setPostError("Error uploading cover photo to S3.");
        return;
      }
      
      cover_s3_url = cover_url;
    }
    
    // Step 3: Call your create post function with the S3 URLs attached.
    const postData = {
      title: postTitle,
      body: postBody,
      tags: selectedTags,
      media: s3_url, // URL for the main media file
      username: user.username,
      genre: selectedTags[0],
      // If this is an audio post, include cover URL
      coverPhoto: cover_s3_url
    };
    
    let createPostResult = await helpers.createpost(postData);
    if (createPostResult.statusCode === 200) {
      console.log("Post created successfully", createPostResult);
    } else {
      console.log("Error creating post", createPostResult);
    }
    
    // Close modal and reset form
    closePostsModal();
  };

  const openTextPostModal = () => {
    setShowTextPostModal(true);
    setShowTooltip(false);
  };

  const closeTextPostModal = () => {
    setShowTextPostModal(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          {/* Brand Name */}
          <Link to="/" className="navbar-brand navbar-logo sigmar-regular">
            UpNextFM
          </Link>

          {/* Navbar Items */}
          <div id="navbarNav" className="ms-auto position-relative">
            {user ? (
              <div className="dropdown" ref={tooltipRef}>
                <button
                  onClick={toggleTooltip}
                  className="btn navbar-icon dropdown-toggle"
                  style={{ border: "none", background: "none" }}
                >
                  <i className="fa-sharp fa-regular fa-user"></i> {user.username}
                </button>
                {showTooltip && (
                  <div className="dropdown-menu show" style={{ right: 0 }}>
                    <button className="dropdown-item" onClick={openProfileModal}>
                      Profile <i className="fa-thin fa-address-card"></i>
                    </button>
                    <Link className="dropdown-item" to="/favorites">
                      Favorites <i className="fa-thin fa-heart"></i>
                    </Link>
                    <button className="dropdown-item" onClick={openTextPostModal}>
                      Submit Post <i className="fa-thin fa-pencil"></i>
                    </button>
                    <button className="dropdown-item" onClick={openPostsModal}>
                      Post Music <i class="fa-thin fa-cloud-arrow-up"></i>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signup" className="btn navbar-icon">
                <i className="fa-sharp fa-regular fa-user"></i> Account
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="container">
                  <div className="row align-items-center">
                    {/* Profile Image */}
                    <div className="col-4 text-center">
                      <img
                        src={user.profilePicture || defaultProfilePic}
                        alt="Profile"
                        className="img-fluid rounded-circle"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    {/* User Details */}
                    <div className="col-8">
                      <h4 className="mb-0">{user.username}</h4>
                      <div className="d-flex justify-content-between mt-2">
                        <div className="text-center">
                          <strong>{user.postsCount || 0}</strong>
                          <div>Posts</div>
                        </div>
                        <div className="text-center">
                          <strong>{user.followersCount || 0}</strong>
                          <div>Supporters</div>
                        </div>
                        <div className="text-center">
                          <strong>{user.followingCount || 0}</strong>
                          <div>Following</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Additional info can be added here */}
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeProfileModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showPostsModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Create Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closePostsModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {postError && (
                  <div className="alert alert-danger" role="alert">
                    {postError}
                  </div>
                )}
                <form onSubmit={handleCreatePost}>
                  <div className="mb-3">
                    <label htmlFor="postTitle" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      id="postTitle"
                      className="form-control"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="postMedia" className="form-label">
                      Media (Picture, Video, or Audio)
                    </label>
                    <input
                      type="file"
                      id="postMedia"
                      className="form-control"
                      accept="image/*,video/*,audio/*"
                      onChange={handleMediaFileChange}
                      required
                    />
                  </div>
                  {mediaFile &&
                    mediaFile.type.startsWith("audio/") && (
                      <div className="mb-3">
                        <label htmlFor="coverPhoto" className="form-label">
                          Cover Photo (required for audio)
                        </label>
                        <input
                          type="file"
                          id="coverPhoto"
                          className="form-control"
                          accept="image/*"
                          onChange={handleCoverPhotoChange}
                          required
                        />
                      </div>
                    )}
                  <div className="mb-3">
                    <label className="form-label">
                      Tags (Select at least one)
                    </label>
                    <div>
                      {tagOptions.map((tag) => (
                        <div className="form-check form-check-inline" key={tag}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`tag-${tag}`}
                            value={tag}
                            checked={selectedTags.includes(tag)}
                            onChange={handleTagChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`tag-${tag}`}
                          >
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="postBody" className="form-label">
                      Body
                    </label>
                    <textarea
                      id="postBody"
                      className="form-control"
                      rows="4"
                      value={postBody}
                      onChange={(e) => setPostBody(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Create Post
                  </button>
                </form>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closePostsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    <TextPostModal
        show={showTextPostModal}
        onClose={closeTextPostModal}
        user={user}
      />
    </>
  );
}

export default Navbar;







