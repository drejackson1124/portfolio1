import React, { useState, useEffect } from "react";
import helpers from "../helpers/helpers";
import "../css/section4.css";
import CommentModal from "./commentmodal";

function Section4() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // New: filter state
  const [filter, setFilter] = useState("All");

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

  // Callback to update the posts state when a comment is added.
  const handleCommentAdded = (postId, newCommentObj) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.postId === postId) {
          const updatedComments = post.comments
            ? [...post.comments, newCommentObj]
            : [newCommentObj];
          return { ...post, comments: updatedComments };
        }
        return post;
      })
    );
  };

  // Derive the filtered posts locally
  const filteredPosts = filter === "All"
    ? posts
    : posts.filter((post) => post.primaryTag === filter);

  // Group the filtered posts in chunks of 4 for pagination (4 posts per slide)
  const groupedPosts = [];
  for (let i = 0; i < filteredPosts.length; i += 4) {
    groupedPosts.push(filteredPosts.slice(i, i + 4));
  }

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
    <div className="section4-wrapper">
      {/* Filter UI (example dropdown) */}
      <div className="filter-bar">
        <select
          id="filterSelect"
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Question">Question</option>
          <option value="Hot Take">Hot Take</option>
          <option value="ISO Features">ISO Features</option>
          <option value="ISO Producers">ISO Producers</option>
          <option value="ISO Writers">ISO Writers</option>
          <option value="Review">Review</option>
          {/* Add more options as needed */}
        </select>
      </div>

      <div className="section4-container">
        {groupedPosts.length === 0 ? (
          <p className="no-posts">No text posts available.</p>
        ) : (
          groupedPosts.map((group, index) => (
            <div key={index} className="post-slide">
              {group.map((post) => (
                <div key={post.postId} className="text-post-card">
                  <div className="text-post-tags">{post.primaryTag}</div>
                  <h2 className="text-post-title mb-0 mt-2">{post.title}</h2>
                  <span className="pink mt-2">@{post.username}</span>
                  <p className="text-post-body">
                    {post.body.length > 50
                      ? post.body.slice(0, 50) + "..."
                      : post.body}
                  </p>
                  <button
                    className="btn btn-secondary sec4-comment-btn mb-2"
                    onClick={() => openCommentModal(post)}
                  >
                    <i className="fa-solid fa-messages"></i>{" "}
                    {post.comments ? post.comments.length : ""}
                  </button>
                </div>
              ))}
            </div>
          ))
        )}

        {showCommentModal && selectedPost && (
          <CommentModal
            show={showCommentModal}
            onClose={closeCommentModal}
            post={selectedPost}
            onCommentAdded={handleCommentAdded}
          />
        )}
      </div>
    </div>
  );
}

export default Section4;






