import React, { useState, useEffect, useContext } from "react";
import helpers from "../helpers/helpers";
import "../css/section4.css";
import CommentModal from "./commentmodal";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import ProfileModal from "./profilemodal";
import FullPageSpinner from "./spinner";

function Section4() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const [profileModalLoading, setProfileModalLoading] = useState(false);
  const { user } = useContext(UserContext);

  // If a user isn't logged in, we store the postId here to show "Please sign in."
  const [loveErrorForPost, setLoveErrorForPost] = useState(null);

  // Filter state
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

  useEffect(() => {}, [selectedPost]);

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPost(null);
  };

  // Open the profile modal by first fetching full user data.
  // While loading, profileModalLoading is true so the spinner is shown.
  const openProfileModal = async (post) => {
    setProfileModalLoading(true);
    try {
      // Assuming helpers.getuser returns the full user details.
      const response = await helpers.getuser({ username: post.username });
      // Update the post object with additional details if needed.
      if (response.user && response.user.bio) {
        post.bio = response.user.bio;
      }

      if(response.user && response.user.profilepic){
        post.profilepic = response.user.profilepic
      }

      setSelectedPost(post);
      setProfileModal(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setProfileModalLoading(false);
    }
  };

  const closeProfileModal = () => {
    setSelectedPost(null);
    setProfileModal(false);
  };

  // Callback to update posts state when a comment is added.
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

  // When the user clicks the heart icon.
  const handleHeartClick = async (post) => {
    if (!user) {
      setLoveErrorForPost(post.postId);
      return;
    }
    setLoveErrorForPost(null);
    let obj = { username: user.username, postId: post.postId };
    const result = await helpers.toggleFavs(obj);
    if (result.statusCode === 200) {
      const updatedPosts = posts.map((p) => {
        if (p.postId === post.postId) {
          let newFavs = p.favorites || [];
          if (newFavs.includes(user.username)) {
            newFavs = newFavs.filter((u) => u !== user.username);
          } else {
            newFavs.push(user.username);
          }
          return { ...p, favorites: newFavs };
        }
        return p;
      });
      setPosts(updatedPosts);
    } else {
      console.log(result);
    }
  };

  // Filter logic.
  const filteredPosts =
    filter === "All" ? posts : posts.filter((post) => post.primaryTag === filter);

  if (loading) {
    return <FullPageSpinner />;
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
        </select>
      </div>

      <div className="section4-container">
        {filteredPosts.length === 0 ? (
          <p className="no-posts text-center">
            No posts available for the selected filter
          </p>
        ) : (
          filteredPosts.map((post) => {
            const isFavorited =
              user &&
              post.favorites &&
              post.favorites.includes(user.username);
            
            return (
              <div key={post.postId} className="text-post-card text-start">
                <div className="text-post-tags text-start sigmar-regular">
                  {post.title.slice(0, 10)}...
                </div>
                <p className="text-post-body text-start mb-0">
                  {post.body.length > 50
                    ? post.body.slice(0, 50) + "..."
                    : post.body}
                  <br />
                </p>
                <button 
                  className="btn btn-sm post-usr-btn mt-1 p-0 sigmar-regular" 
                  onClick={() => openProfileModal(post)}
                  style={{ textAlign: "left !important" }}
                >
                  {/* <img src="" className="" /> */}
                  @{post.username}
                </button>
                <button
                  className="sec4-comment-btn mb-2 ms-1"
                  onClick={() => openCommentModal(post)}
                >
                  <i className="fa-solid fa-comment"></i>{" "}
                  {post.comments ? (
                    <span className="small-comments-text">{post.comments.length}</span>
                  ) : (
                    <span className="small-comments-text"></span>
                  )}
                </button>
                {isFavorited ? (
                  <i
                    className="fa-solid fa-heart ms-1"
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => handleHeartClick(post)}
                  ></i>
                ) : (
                  <i
                    className="fa-regular fa-heart ms-1"
                    style={{ color: "white", cursor: "pointer" }}
                    onClick={() => handleHeartClick(post)}
                  ></i>
                )}
                {loveErrorForPost === post.postId && (
                  <div className="love-error-message">
                    Please <Link to="signin">sign in</Link> to like this post.
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {profileModalLoading && <FullPageSpinner />}

      {showCommentModal && selectedPost && (
        <CommentModal
          show={showCommentModal}
          onClose={closeCommentModal}
          post={selectedPost}
          onCommentAdded={handleCommentAdded}
        />
      )}

      {profileModal && selectedPost && (
        <ProfileModal
          show={profileModal}
          onClose={closeProfileModal}
          currentUser={user}
          clickedUser={selectedPost}
        />
      )}
    </div>
  );
}

export default Section4;
