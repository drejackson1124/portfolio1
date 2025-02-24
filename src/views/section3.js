import React, { useEffect } from "react";
import helpers from "../helpers/helpers";
import "../css/section3.css";

// Helper function to fetch posts
const fetchPosts = async () => {
  const response = await helpers.getposts({});
  // If response.body is a string, parse it; otherwise assume it's already an object.
  return typeof response.body === "string"
    ? JSON.parse(response.body)
    : response.body;
};

function Section3({ posts, setPosts }) {
  useEffect(() => {
    const getPosts = async () => {
      try {
        const fetchedData = await fetchPosts();
        // Expected structure: { posts: [...] }
        setPosts(fetchedData.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    getPosts();
  }, [setPosts]);

  if (!posts || posts.length === 0) {
    return <div className="section3-no-posts">No posts to display.</div>;
  }

const renderMedia = (post) => {
    const mediaUrl = post.media;
    const lower = mediaUrl.toLowerCase();
  
    if (/\.(jpeg|jpg|png|gif)$/.test(lower)) {
      return <img src={mediaUrl} alt="post media" />;
    } else if (/\.(mp4|mov)$/.test(lower)) {
      return (
        <video src={mediaUrl} controls controlsList="nodownload" style={{ width: "100%" }}>
          Your browser does not support the video tag.
        </video>
      );
    } else if (/\.(mp3|wav)$/.test(lower)) {
      return (
        <div className="audio-media-container">
          {post.coverPhoto && (
            <img
              src={post.coverPhoto}
              alt="cover"
              className="audio-cover"
            />
          )}
          <audio src={mediaUrl} controls controlsList="nodownload" style={{ width: "100%" }} className="mt-2">
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    } else {
      return <div>Unsupported media type.</div>;
    }
  };
  



  return (
    <div className="section3-container">
      {posts.map((post) => (
        <div key={post.postid} className="post-card">
          <div className="post-media">{renderMedia(post)}</div>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-body">{post.body}</p>
          <p className="post-tags">
            Tags: {Array.isArray(post.tags) ? post.tags.join(", ") : ""}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Section3;

