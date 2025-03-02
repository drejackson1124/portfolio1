// import React, { useEffect, useState } from "react";
// import helpers from "../helpers/helpers";
// import "../css/section3.css";
// import CustomAudioPlayer from "./customaudio";
// import VideoComponent from "./customvideo";
// import SurveyModal from "./surveymodal";


// const fetchPosts = async () => {
//   const response = await helpers.getposts({});
//   return typeof response.body === "string"
//     ? JSON.parse(response.body)
//     : response.body;
// };

// function Section3({ posts, setPosts }) {
//  const [showSurvey, setShowSurvey] = useState(false);
//  const [selectedPost, setSelectedPost] = useState(null);
//   useEffect(() => {
//     const getPosts = async () => {
//       try {
//         const fetchedData = await fetchPosts();
//         setPosts(fetchedData.posts);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     };
//     getPosts();
//   }, [setPosts]);

//   if (!posts || posts.length === 0) {
//     return <div className="section3-no-posts">No posts to display.</div>;
//   }

// const renderMedia = (post) => {
//     console.log(post);
//     const mediaUrl = post.media;
//     const lower = mediaUrl.toLowerCase();
  
//     if (/\.(jpeg|jpg|png|gif)$/.test(lower)) {
//       return <img src={mediaUrl} alt="post media" />;
//     } else if (/\.(mp4|mov)$/.test(lower)) {
//     return <VideoComponent post={post} />;
//     } else if (/\.(mp3|wav)$/.test(lower)) {
//     return (
//         <CustomAudioPlayer src={mediaUrl} coverPhoto={post.coverPhoto} post={post} />
//       );
//     } else {
//       return <div>Unsupported media type.</div>;
//     }
//   };
  
//   const openSurveyForPost = (post) => {
//     setSelectedPost(post);
//     setShowSurvey(true);
//   };

// return (
//     <div className="section3-container">
//       {posts.map((post) => (
//         <div key={post.postid} className="post-card">
//           <div className="post-media">{renderMedia(post)}</div>
//           <h3 className="post-title">
//             <button className="btn btn-primary btn-sm sec3-artist-btn">
//                 {post.title} <span className="white">|</span>{" "}
//                 <span className="pink">@{post.username}</span>{" "}

//             </button> {" "}
//             <button
//             className="btn btn-primary btn-sm rate-btn"
//             onClick={() => openSurveyForPost(post)}
//           >
//             <i className="fa-solid fa-stars rate-icon"></i>{" "} Rate

//           </button>
//           </h3>
//           <p className="post-body">{post.body}</p>
//         </div>
//       ))}
//       {showSurvey && selectedPost && (
//         <SurveyModal
//           show={showSurvey}
//           onClose={() => setShowSurvey(false)}
//           post={selectedPost}
//         />
//       )}
//     </div>
//   );
  
// }

// export default Section3;

import React, { useEffect, useState } from "react";
import helpers from "../helpers/helpers";
import "../css/section3.css";
import CustomAudioPlayer from "./customaudio";
import VideoComponent from "./customvideo";
import SurveyModal from "./surveymodal";

const fetchPosts = async () => {
  const response = await helpers.getposts({});
  return typeof response.body === "string"
    ? JSON.parse(response.body)
    : response.body;
};

function Section3({ posts, setPosts }) {
  const [showSurvey, setShowSurvey] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

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

  const renderMedia = (post) => {
    const mediaUrl = post.media;
    const lower = mediaUrl.toLowerCase();
  
    if (/\.(jpeg|jpg|png|gif)$/.test(lower)) {
      return <img src={mediaUrl} alt="post media" />;
    } else if (/\.(mp4|mov)$/.test(lower)) {
      return <VideoComponent post={post} />;
    } else if (/\.(mp3|wav)$/.test(lower)) {
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

  return (
    <div className="section3-container">
      {posts.map((post) => {
        const avgRating = getAverageRating(post);
        return (
          <div key={post.postid} className="post-card">
            <div className="post-media">{renderMedia(post)}</div>
            <h3 className="post-title">
              <button className="btn btn-primary btn-sm sec3-artist-btn">
                {post.title} <span className="white">|</span>{" "}
                <span className="pink">@{post.username}</span>
              </button>{" "}
              <button
                className="btn btn-primary btn-sm rate-btn"
                onClick={() => openSurveyForPost(post)}
              >
                <i className="fa-solid fa-stars rate-icon"></i>{" "} Rate
              </button>
              <button className="btn btn-sm rating-btn">
                {avgRating ? `${avgRating}/5`: ""}
              </button>
            </h3>
            <p className="post-body">
                {post.body.length > 30
                    ? post.body.slice(0, 30) + "..."
                    : post.body
                }
            </p>

          </div>
        );
      })}
      {showSurvey && selectedPost && (
        <SurveyModal
          show={showSurvey}
          onClose={() => setShowSurvey(false)}
          post={selectedPost}
        />
      )}
    </div>
  );
}

export default Section3;



