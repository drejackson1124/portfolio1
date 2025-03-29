import React, { useContext, useEffect, useState } from "react";
import helpers from "../helpers/helpers";
import "../css/section3.css";
import CustomAudioPlayer from "./customaudio";
import VideoComponent from "./customvideo";
import SurveyModal from "./surveymodal";
import { UserContext } from "../UserContext";
import FavoriteHeart from "./favoriteheart";

// Fetch posts from backend
const fetchPosts = async () => {
  const response = await helpers.getposts({});
  return typeof response.body === "string"
    ? JSON.parse(response.body)
    : response.body;
};

function Section3({ posts, setPosts }) {
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useContext(UserContext);
  const isFavorited = posts.favorites && posts.favorites.includes(user.username);

  // New: filter state
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const getPosts = async () => {
      try {
        const fetchedData = await fetchPosts();
        setPosts(fetchedData.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    getPosts();
  }, [setPosts]);

  // If no posts, display message
  if (!posts || posts.length === 0) {
    return <div className="section3-no-posts">No posts to display.</div>;
  }

  // Helper function to compute the average rating for a post
  const getAverageRating = (post) => {
    if (!post.ratings || post.ratings.length === 0) {
      return null; // No ratings yet
    }
    let totalPoints = 0;
    let ratingCount = 0;
    // Each rating has 3 categories: style, delivery, originality
    post.ratings.forEach((r) => {
      totalPoints += (r.style + r.delivery + r.originality);
      ratingCount += 3;
    });
    const avg = totalPoints / ratingCount;
    return avg.toFixed(1); // Round to 1 decimal place
  };

  // Render media (image, video, or audio)
  const renderMedia = (post) => {
    const mediaUrl = post.media;
    const lower = mediaUrl.toLowerCase();
  
    if (/\.(jpeg|jpg|png|gif)$/.test(lower)) {
      return <img src={mediaUrl} alt="post media" />;
    } else if (/\.(mp4|mov)$/.test(lower)) {
      return <VideoComponent post={post} />;
    } else if (/\.(mp3|wav|m4a|aac)$/.test(lower)) {
      return (
        <CustomAudioPlayer src={mediaUrl} coverPhoto={post.coverPhoto} post={post} />
      );
    } else {
      return <div>Unsupported media type.</div>;
    }
  };
  
  const openSurveyForPost = (post) => {
    setSelectedPost(post);
    setShowSurvey(true);
  };

  // Filter the posts by primaryTag (which is post.tags[0])
  // If filter === "All", show all
  const filteredPosts =
    filter === "All"
      ? posts
      : posts.filter(
          (post) => post.tags && post.tags.length > 0 && post.tags[0] === filter
        );

  return (
    <div className="section3-wrapper">
      {/* Filter UI */}
      <div className="section3-filter-bar mb-4">
        <select
          id="tagFilter"
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Rap">Rap</option>
          <option value="RnB">RnB</option>
          {/* Add more options if needed */}
        </select>
      </div>

      {/* Post Cards */}
      <div className="section3-container">
        {filteredPosts.length === 0 ? (
          <div className="section3-no-posts">No posts match the selected filter.</div>
        ) : (
          filteredPosts.map((post) => {
            const avgRating = getAverageRating(post);
            return (
              <div key={post.postid} className="post-card">
                <div className="post-media">{renderMedia(post)}</div>
                <h3 className="post-title">
                  <button className="btn btn-primary btn-sm sec3-artist-btn">
                    {post.title} <br/>
                    <span className="dodgerblue">@{post.username}</span>
                  </button>{" "}
                </h3>
                <h3>
                  <button
                    className="btn btn-primary btn-sm rate-btn"
                    onClick={() => openSurveyForPost(post)}
                  >
                    <i className="fa-solid fa-stars rate-icon"></i>{" "}Rate
                  </button>
                  <button className="btn btn-sm rating-btn">
                    <i className="fa-solid fa-star"></i>{" "}
                    {avgRating ? `${avgRating}/5` : ""}
                  </button>
                  <FavoriteHeart
                    postId={post.postId}
                    initiallyFavorited={isFavorited}
                    className="sec3-favorite-heart"
                  />
                </h3>
                {/* <p className="post-body">
                  {post.body.length > 30
                    ? post.body.slice(0, 30) + "..."
                    : post.body
                  }
                </p> */}
              </div>
            );
          })
        )}

        {/* Survey Modal */}
        {showSurvey && selectedPost && (
          <SurveyModal
            show={showSurvey}
            onClose={() => setShowSurvey(false)}
            post={selectedPost}
          />
        )}
      </div>
    </div>
  );
}

export default Section3;




