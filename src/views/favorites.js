// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../UserContext";
// import helpers from "../helpers/helpers";
// import "../css/favorites.css";
// import CommentModal from "./commentmodal";
// import { Link } from "react-router-dom";
// import CustomAudioPlayer from "./customaudio";
// import VideoComponent from "./customvideo";

// function Favorites() {
//   const { user } = useContext(UserContext);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   // State for controlling the CommentModal for a specific favorite post
//   const [showCommentModal, setShowCommentModal] = useState(false);
//   const [selectedFavorite, setSelectedFavorite] = useState(null);

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       if (!user) {
//         setError("Please sign in to view your favorites.");
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await helpers.getFavs({ username: user.username });
//         const data =
//           typeof response.body === "string"
//             ? JSON.parse(response.body)
//             : response.body;
//         // Updated backend returns full post objects under data.posts
//         setFavorites(data.posts || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching favorites:", err);
//         setError("Error fetching favorites.");
//         setLoading(false);
//       }
//     };
//     fetchFavorites();
//   }, [user]);

//   const openCommentModal = (fav) => {
//     setSelectedFavorite(fav);
//     setShowCommentModal(true);
//   };

//   const closeCommentModal = () => {
//     setShowCommentModal(false);
//     setSelectedFavorite(null);
//   };

//   // Archive a favorite by calling the archiveFavorite helper.
//   const handleArchive = async (fav) => {
//     try {
//       const result = await helpers.archiveFavorite({
//         username: user.username,
//         postId: fav.postId,
//       });
//       if (result.statusCode === 200) {
//         // Update local favorites state: mark this favorite as archived.
//         const updatedFavorites = favorites.map((f) => {
//           if (f.postId === fav.postId) {
//             return { ...f, archived: true };
//           }
//           return f;
//         });
//         setFavorites(updatedFavorites);
//       } else {
//         console.log("Archive error:", result);
//       }
//     } catch (err) {
//       console.error("Error archiving favorite:", err);
//     }
//   };

//   // Render media if available.
//   const renderMedia = (fav) => {
//     if (!fav.media) return null;
//     const mediaUrl = fav.media;
//     const lower = mediaUrl.toLowerCase();
//     if (/\.(mp4|mov|webm)$/.test(lower)) {
//       return <VideoComponent post={fav} />;
//     } else if (/\.(mp3|wav|m4a|aac)$/.test(lower)) {
//       return <CustomAudioPlayer src={mediaUrl} coverPhoto={fav.coverPhoto} post={fav} />;
//     } else if (/\.(jpeg|jpg|png|gif)$/.test(lower)) {
//       return <img src={mediaUrl} alt="media" />;
//     } else {
//       return <div>Unsupported media type</div>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="favorites-container">
//         <div className="spinner">Loading...</div>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="favorites-container">
//         <p className="error">{error}</p>
//       </div>
//     );
//   }
  
//   // Separate active favorites (not archived) from archived ones.
//   const activeFavorites = favorites.filter((fav) => !fav.archived);
//   const archivedCount = favorites.filter((fav) => fav.archived).length;

//   return (
//     <div className="favorites-container">
//       <h2>Your Favorites</h2>
//       {archivedCount > 0 && (
//         <div className="archived-summary">
//           ({archivedCount} archived)
//         </div>
//       )}
//       {activeFavorites.length === 0 ? (
//         <p className="no-favorites text-center">
//           You have not favorited any posts yet.
//         </p>
//       ) : (
//         <div className="favorites-grid">
//           {activeFavorites.map((fav) => {
//             // Format timestamp (assumed to be in seconds)
//             const formattedDate = new Date(fav.timestamp * 1000).toLocaleString();
//             return (
//               <div key={fav.postId} className="favorite-card">
//                 {fav.media && (
//                   <div className="favorite-media">
//                     {renderMedia(fav)}
//                   </div>
//                 )}
//                 <h3 className="favorite-title">{fav.title.length > 10 ? fav.title.slice(0,10) + "..." : fav.title}</h3>
//                 <p className="favorite-body">
//                   {fav.body && fav.body.length > 30 ? fav.body.slice(0, 30) + "..." : fav.body}
//                 </p>
//                 <p className="favorite-username">@{fav.username}</p>
//                 <button
//                   className="sec4-comment-btn mb-2"
//                   onClick={() => openCommentModal(fav)}
//                 >
//                   <i className="fa-solid fa-comment"></i>{" "}
//                   {fav.comments ? (
//                     <span className="small-comments-text">{fav.comments.length}</span>
//                   ) : (
//                     <span className="small-comments-text"></span>
//                   )}
//                 </button>
//                 {!fav.archived ? (
//                   <button className="archive-btn" onClick={() => handleArchive(fav)}>
//                     <i className="fa-solid fa-archive"></i> Archive
//                   </button>
//                 ) : (
//                   <span className="archived-text">Archived</span>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//       {showCommentModal && selectedFavorite && (
//         <CommentModal
//           show={showCommentModal}
//           onClose={closeCommentModal}
//           post={selectedFavorite}
//         />
//       )}
//     </div>
//   );
// }

// export default Favorites;


// SECTION 2 GREYED OUT

// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../UserContext";
// import helpers from "../helpers/helpers";
// import "../css/favorites.css";
// import CommentModal from "./commentmodal";
// import { Link } from "react-router-dom";
// import CustomAudioPlayer from "./customaudio";
// import VideoComponent from "./customvideo";

// function Favorites() {
//   const { user } = useContext(UserContext);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   // State for controlling the CommentModal for a specific favorite post
//   const [showCommentModal, setShowCommentModal] = useState(false);
//   const [selectedFavorite, setSelectedFavorite] = useState(null);
  
//   // If a user isn't logged in, we store the postId here to show "Please sign in."
//   const [loveErrorForPost, setLoveErrorForPost] = useState(null);
  
//   // Filter state (by primaryTag)
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       if (!user) {
//         setError("Please sign in to view your favorites.");
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await helpers.getFavs({ username: user.username });
//         const data =
//           typeof response.body === "string"
//             ? JSON.parse(response.body)
//             : response.body;
//         // Updated backend returns full post objects under data.posts
//         setFavorites(data.posts || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching favorites:", err);
//         setError("Error fetching favorites.");
//         setLoading(false);
//       }
//     };
//     fetchFavorites();
//   }, [user]);

//   const openCommentModal = (fav) => {
//     setSelectedFavorite(fav);
//     setShowCommentModal(true);
//   };

//   const closeCommentModal = () => {
//     setShowCommentModal(false);
//     setSelectedFavorite(null);
//   };

//   // Archive a favorite by calling the archiveFavorite helper.
//   const handleArchive = async (fav) => {
//     try {
//       const result = await helpers.archiveFavorite({
//         username: user.username,
//         postId: fav.postId,
//       });
//       if (result.statusCode === 200) {
//         // Update local favorites state: mark this favorite as archived.
//         const updatedFavorites = favorites.map((f) => {
//           if (f.postId === fav.postId) {
//             return { ...f, archived: true };
//           }
//           return f;
//         });
//         setFavorites(updatedFavorites);
//       } else {
//         console.log("Archive error:", result);
//       }
//     } catch (err) {
//       console.error("Error archiving favorite:", err);
//     }
//   };

//   // Helper functions to determine content type
//   const isVideo = (url) => {
//     const lower = url.toLowerCase();
//     return /\.(mp4|mov|webm)$/.test(lower);
//   };

//   const isAudio = (url) => {
//     const lower = url.toLowerCase();
//     return /\.(mp3|wav|m4a|aac)$/.test(lower);
//   };

//   // Render media based on type
//   const renderMedia = (fav) => {
//     if (!fav.media) return null;
//     const mediaUrl = fav.media;
//     const lower = mediaUrl.toLowerCase();
//     if (isVideo(mediaUrl)) {
//       return <VideoComponent post={fav} />;
//     } else if (isAudio(mediaUrl)) {
//       return <CustomAudioPlayer src={mediaUrl} coverPhoto={fav.coverPhoto} post={fav} />;
//     } else if (/\.(jpeg|jpg|png|gif)$/.test(lower)) {
//       return <img src={mediaUrl} alt="media" />;
//     } else {
//       return <div>Unsupported media type</div>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="favorites-container">
//         <div className="spinner">Loading...</div>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="favorites-container">
//         <p className="error">{error}</p>
//       </div>
//     );
//   }
  
//   // Separate active favorites (not archived)
//   const activeFavorites = favorites.filter((fav) => !fav.archived);

//   // Apply filter by primaryTag if not "All"
//   const filteredFavorites =
//     filter === "All"
//       ? activeFavorites
//       : activeFavorites.filter(
//           (fav) => fav.primaryTag === filter
//         );

//   // Group filtered favorites by type
//   const videoFavorites = filteredFavorites.filter(
//     (fav) => fav.media && isVideo(fav.media)
//   );
//   const audioFavorites = filteredFavorites.filter(
//     (fav) => fav.media && isAudio(fav.media)
//   );
//   const textFavorites = filteredFavorites.filter(
//     (fav) => !fav.media
//   );

//   return (
//     <div className="favorites-container">
//       <h2>Your Favorites</h2>
//       <div className="filter-bar">
//         <select
//           id="filterSelect"
//           className="form-select"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           <option value="All">All</option>
//           <option value="Question">Question</option>
//           <option value="Hot Take">Hot Take</option>
//           <option value="ISO Features">ISO Features</option>
//           <option value="ISO Producers">ISO Producers</option>
//           <option value="ISO Writers">ISO Writers</option>
//           <option value="Review">Review</option>
//         </select>
//       </div>

//       {/* Section for Favorite Videos */}
//       {videoFavorites.length > 0 && (
//         <>
//           <h3 className="section-header">Favorite Videos</h3>
//           <div className="favorites-grid">
//             {videoFavorites.map((fav) => {
//               const formattedDate = new Date(fav.timestamp * 1000).toLocaleString();
//               return (
//                 <div key={fav.postId} className="favorite-card">
//                   <div className="favorite-media">
//                     {renderMedia(fav)}
//                   </div>
//                   <h3 className="favorite-title">
//                     {fav.title.length > 10 ? fav.title.slice(0, 10) + "..." : fav.title}
//                   </h3>
//                   <p className="favorite-body">
//                     {fav.body && fav.body.length > 30 ? fav.body.slice(0, 30) + "..." : fav.body}
//                   </p>
//                   <p className="favorite-username">@{fav.username}</p>
//                   <p className="favorite-timestamp">
//                     Favorited on: {formattedDate}
//                   </p>
//                   <button
//                     className="sec4-comment-btn mb-2"
//                     onClick={() => openCommentModal(fav)}
//                   >
//                     <i className="fa-solid fa-comment"></i>{" "}
//                     {fav.comments ? (
//                       <span className="small-comments-text">{fav.comments.length}</span>
//                     ) : (
//                       <span className="small-comments-text"></span>
//                     )}
//                   </button>
//                   <button className="archive-btn" onClick={() => handleArchive(fav)}>
//                     <i className="fa-solid fa-archive"></i> Archive
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}

//       {/* Section for Songs You Love (Audio Favorites) */}
//       {audioFavorites.length > 0 && (
//         <>
//           <h3 className="section-header">Songs You Love</h3>
//           <div className="favorites-grid">
//             {audioFavorites.map((fav) => {
//               const formattedDate = new Date(fav.timestamp * 1000).toLocaleString();
//               return (
//                 <div key={fav.postId} className="favorite-card">
//                   <div className="favorite-media">
//                     {renderMedia(fav)}
//                   </div>
//                   <h3 className="favorite-title">
//                     {fav.title.length > 10 ? fav.title.slice(0, 10) + "..." : fav.title}
//                   </h3>
//                   <p className="favorite-body">
//                     {fav.body && fav.body.length > 30 ? fav.body.slice(0, 30) + "..." : fav.body}
//                   </p>
//                   <p className="favorite-username">@{fav.username}</p>
//                   <p className="favorite-timestamp">
//                     Favorited on: {formattedDate}
//                   </p>
//                   <button
//                     className="sec4-comment-btn mb-2"
//                     onClick={() => openCommentModal(fav)}
//                   >
//                     <i className="fa-solid fa-comment"></i>{" "}
//                     {fav.comments ? (
//                       <span className="small-comments-text">{fav.comments.length}</span>
//                     ) : (
//                       <span className="small-comments-text"></span>
//                     )}
//                   </button>
//                   <button className="archive-btn" onClick={() => handleArchive(fav)}>
//                     <i className="fa-solid fa-archive"></i> Archive
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}

//       {/* Section for Text Posts (Join the Discussion) */}
//       {textFavorites.length > 0 && (
//         <>
//           <h3 className="section-header">Join the Discussion</h3>
//           <div className="favorites-grid">
//             {textFavorites.map((fav) => {
//               const formattedDate = new Date(fav.timestamp * 1000).toLocaleString();
//               return (
//                 <div key={fav.postId} className="favorite-card">
//                   <h3 className="favorite-title">
//                     {fav.title.length > 10 ? fav.title.slice(0, 10) + "..." : fav.title}
//                   </h3>
//                   <p className="favorite-body">
//                     {fav.body && fav.body.length > 50 ? fav.body.slice(0, 50) + "..." : fav.body}
//                   </p>
//                   <p className="favorite-username">@{fav.username}</p>
//                   <p className="favorite-timestamp">
//                     Favorited on: {formattedDate}
//                   </p>
//                   <button
//                     className="sec4-comment-btn mb-2"
//                     onClick={() => openCommentModal(fav)}
//                   >
//                     <i className="fa-solid fa-comment"></i>{" "}
//                     {fav.comments ? (
//                       <span className="small-comments-text">{fav.comments.length}</span>
//                     ) : (
//                       <span className="small-comments-text"></span>
//                     )}
//                   </button>
//                   <button className="archive-btn" onClick={() => handleArchive(fav)}>
//                     <i className="fa-solid fa-archive"></i> Archive
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}

//       {showCommentModal && selectedFavorite && (
//         <CommentModal
//           show={showCommentModal}
//           onClose={closeCommentModal}
//           post={selectedFavorite}
//         />
//       )}
//     </div>
//   );
// }

// export default Favorites;


import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import helpers from "../helpers/helpers";
import "../css/favorites.css";
import CommentModal from "./commentmodal";
import { Link } from "react-router-dom";
import CustomAudioPlayer from "./customaudio";
import VideoComponent from "./customvideo";

function Favorites() {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for controlling the CommentModal for a specific favorite post
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  
  // For showing "Please sign in" message for a specific post when a user tries to favorite
  const [loveErrorForPost, setLoveErrorForPost] = useState(null);
  
  // Filter state: Options: "All", "Videos", "Songs", "Conversations"
  const [filter, setFilter] = useState("All");
  
  // Helper functions to determine content type
  const isVideo = (url) => {
    const lower = url.toLowerCase();
    return /\.(mp4|mov|webm)$/.test(lower);
  };
  
  const isAudio = (url) => {
    const lower = url.toLowerCase();
    return /\.(mp3|wav|m4a|aac)$/.test(lower);
  };
  
  // Determine post type: "Videos", "Songs", or "Conversations" (for text-only)
  const getPostType = (post) => {
    if (post.media) {
      if (isVideo(post.media)) return "Videos";
      if (isAudio(post.media)) return "Songs";
    }
    return "Conversations";
  };
  
  // Render media based on type
  const renderMedia = (fav) => {
    if (!fav.media) return null;
    const mediaUrl = fav.media;
    const lower = mediaUrl.toLowerCase();
    if (isVideo(mediaUrl)) {
      return <VideoComponent post={fav} />;
    } else if (isAudio(mediaUrl)) {
      return <CustomAudioPlayer src={mediaUrl} coverPhoto={fav.coverPhoto} post={fav} />;
    } else if (/\.(jpeg|jpg|png|gif)$/.test(lower)) {
      return <img src={mediaUrl} alt="media" />;
    } else {
      return <div>Unsupported media type</div>;
    }
  };
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setError("Please sign in to view your favorites.");
        setLoading(false);
        return;
      }
      try {
        const response = await helpers.getFavs({ username: user.username });
        const data =
          typeof response.body === "string"
            ? JSON.parse(response.body)
            : response.body;
        // Updated backend returns full post objects under data.posts
        setFavorites(data.posts || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Error fetching favorites.");
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);
  
  const openCommentModal = (fav) => {
    setSelectedFavorite(fav);
    setShowCommentModal(true);
  };
  
  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedFavorite(null);
  };
  
  // Archive a favorite by calling the archiveFavorite helper.
  const handleArchive = async (fav) => {
    try {
      const result = await helpers.archiveFavorite({
        username: user.username,
        postId: fav.postId,
      });
      if (result.statusCode === 200) {
        // Update local favorites state: mark this favorite as archived.
        const updatedFavorites = favorites.map((f) => {
          if (f.postId === fav.postId) {
            return { ...f, archived: true };
          }
          return f;
        });
        setFavorites(updatedFavorites);
      } else {
        console.log("Archive error:", result);
      }
    } catch (err) {
      console.error("Error archiving favorite:", err);
    }
  };
  
  // When the user clicks the heart icon
  const handleHeartClick = async (fav) => {
    if (!user) {
      setLoveErrorForPost(fav.postId);
      return;
    }
    setLoveErrorForPost(null);
    let obj = { username: user.username, postId: fav.postId };
    const result = await helpers.toggleFavs(obj);
    if (result.statusCode === 200) {
      const updatedFavorites = favorites.map((f) => {
        if (f.postId === fav.postId) {
          let newFavs = f.favorites || [];
          if (newFavs.includes(user.username)) {
            newFavs = newFavs.filter((u) => u !== user.username);
          } else {
            newFavs.push(user.username);
          }
          return { ...f, favorites: newFavs };
        }
        return f;
      });
      setFavorites(updatedFavorites);
    } else {
      console.log(result);
    }
  };
  
  if (loading) {
    return (
      <div className="favorites-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="favorites-container">
        <p className="error">{error}</p>
      </div>
    );
  }
  
  // Separate active favorites (non-archived)
  const activeFavorites = favorites.filter((fav) => !fav.archived);
  
  // Apply filter by post type if not "All"
  const filteredFavorites =
    filter === "All"
      ? activeFavorites
      : activeFavorites.filter((fav) => getPostType(fav) === filter);
  
  // Group favorites into sections by type:
  const videoFavorites = filteredFavorites.filter(
    (fav) => fav.media && isVideo(fav.media)
  );
  const audioFavorites = filteredFavorites.filter(
    (fav) => fav.media && isAudio(fav.media)
  );
  const textFavorites = filteredFavorites.filter(
    (fav) => !fav.media || getPostType(fav) === "Conversations"
  );
  
  return (
    <div className="favorites-container">
      <h2 className="sigmar-regular">Your Favorites <i class="fa-solid fa-heart ms-1 red-color"></i></h2>
      <div className="filter-bar">
        <select
          id="filterSelect"
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Videos">Videos</option>
          <option value="Songs">Songs</option>
          <option value="Conversations">Conversations</option>
        </select>
      </div>
  
      {videoFavorites.length > 0 && (
        <>
          <h3 className="section-header text-start mt-5 sigmar-regular mb-4">Favorite Videos</h3>
          <div className="favorites-grid">
            {videoFavorites.map((fav) => {
              const formattedDate = new Date(fav.timestamp * 1000).toLocaleString();
              return (
                <div key={fav.postId} className="favorite-card">
                  <div className="favorite-media">
                    {renderMedia(fav)}
                  </div>
                  <h3 className="favorite-title">
                    {fav.title.length > 10 ? fav.title.slice(0, 10) + "..." : fav.title}
                  </h3>
                  <p className="favorite-body">
                    {fav.body && fav.body.length > 30 ? fav.body.slice(0, 30) + "..." : fav.body}
                  </p>
                  <p className="favorite-username">{fav.username}</p>
                  <button
                    className="sec4-comment-btn mb-2"
                    onClick={() => openCommentModal(fav)}
                  >
                    <i className="fa-solid fa-comment"></i>{" "}
                    {fav.comments ? (
                      <span className="small-comments-text">{fav.comments.length}</span>
                    ) : (
                      <span className="small-comments-text"></span>
                    )}
                  </button>
                  <button className="archive-btn" onClick={() => handleArchive(fav)}>
                    <i className="fa-solid fa-archive"></i> Archive
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
  
      {audioFavorites.length > 0 && (
        <>
          <h3 className="section-header text-start mt-5 sigmar-regular mb-4">Songs You Love</h3>
          <div className="favorites-grid">
            {audioFavorites.map((fav) => {
              const formattedDate = new Date(fav.timestamp * 1000).toLocaleString();
              return (
                <div key={fav.postId} className="favorite-card">
                  <div className="favorite-media">
                    {renderMedia(fav)}
                  </div>
                  <h3 className="favorite-title">
                    {fav.title.length > 10 ? fav.title.slice(0, 10) + "..." : fav.title}
                  </h3>
                  <p className="favorite-body">
                    {fav.body && fav.body.length > 30 ? fav.body.slice(0, 30) + "..." : fav.body}
                  </p>
                  <p className="favorite-username">{fav.username}</p>
                  <button
                    className="sec4-comment-btn mb-2"
                    onClick={() => openCommentModal(fav)}
                  >
                    <i className="fa-solid fa-comment"></i>{" "}
                    {fav.comments ? (
                      <span className="small-comments-text">{fav.comments.length}</span>
                    ) : (
                      <span className="small-comments-text"></span>
                    )}
                  </button>
                  <button className="archive-btn" onClick={() => handleArchive(fav)}>
                    <i className="fa-solid fa-archive"></i> Archive
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
  
      {textFavorites.length > 0 && (
        <>
          <h3 className="section-header text-start mt-5 sigmar-regular mb-4">Conversations</h3>
          <div className="favorites-grid">
            {textFavorites.map((fav) => {
              const formattedDate = new Date(fav.timestamp * 1000).toLocaleString();
              return (
                <div key={fav.postId} className="favorite-card">
                  <h3 className="favorite-title">
                    {fav.title.length > 10 ? fav.title.slice(0, 10) + "..." : fav.title}
                  </h3>
                  <p className="favorite-body">
                    {fav.body && fav.body.length > 50 ? fav.body.slice(0, 50) + "..." : fav.body}
                  </p>
                  <p className="favorite-username">{fav.username}</p>
                  <button
                    className="sec4-comment-btn mb-2"
                    onClick={() => openCommentModal(fav)}
                  >
                    <i className="fa-solid fa-comment"></i>{" "}
                    {fav.comments ? (
                      <span className="small-comments-text">{fav.comments.length}</span>
                    ) : (
                      <span className="small-comments-text"></span>
                    )}
                  </button>
                  <button className="archive-btn" onClick={() => handleArchive(fav)}>
                    <i className="fa-solid fa-archive"></i> Archive
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
  
      {showCommentModal && selectedFavorite && (
        <CommentModal
          show={showCommentModal}
          onClose={closeCommentModal}
          post={selectedFavorite}
        />
      )}
    </div>
  );
}

export default Favorites;
