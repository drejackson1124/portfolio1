import React, { useState, useEffect } from "react";
import helpers from "../helpers/helpers";
import "../css/section4.css";
import CommentModal from "./commentmodal.js";

function Section4() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchTextPosts = async () => {
      try {
        const response = await helpers.gettextpost({});
        const data =
          typeof response.body === "string"
            ? JSON.parse(response.body)
            : response.body;
        setPosts(data.posts || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching text posts:", err);
        setError("Error fetching text posts.");
        setLoading(false);
      }
    };
    fetchTextPosts();
  }, []);

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <div className="section4-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section4-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="section4-container">
      {posts.length === 0 ? (
        <p className="no-posts">No text posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.postId} className="text-post-card">
            {/* Tag in the corner */}
            <div className="text-post-tags">{post.primaryTag}</div>

            {/* Post Title and username */}
            <h2 className="text-post-title mb-0">{post.title}</h2>
            <span className="pink">@{post.username}</span>

            {/* Body */}
            <p className="text-post-body">{post.body}</p>

            {/* Comment icon/button */}
            <button
              className="btn btn-secondary sec4-comment-btn"
              onClick={() => openCommentModal(post)}
            >
              <i className="fa-solid fa-comment"></i> Comments
            </button>
          </div>
        ))
      )}

      {/* Comment Modal */}
      {showCommentModal && selectedPost && (
        <CommentModal
          show={showCommentModal}
          onClose={closeCommentModal}
          post={selectedPost}
        />
      )}
    </div>
  );
}

export default Section4;

