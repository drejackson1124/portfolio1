// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../UserContext";
// import helpers from "../helpers/helpers";
// import "../css/favorites.css";

// function Favorites() {
//   const { user } = useContext(UserContext);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

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
//         // Our updated backend returns an object with a posts property.
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

//   // Archive a favorite by calling the helper function.
//   // On success, update local state so that the archived favorite is marked.
//   const handleArchive = async (fav) => {
//     try {
//       const response = await helpers.archiveFavorite({ username: user.username, postId: fav.postId });
//       if (response.statusCode === 200) {
//         const updatedFavorites = favorites.map((f) => {
//           if (f.postId === fav.postId) {
//             return { ...f, archived: true };
//           }
//           return f;
//         });
//         setFavorites(updatedFavorites);
//       } else {
//         console.log("Archive error:", response);
//       }
//     } catch (error) {
//       console.error("Error archiving favorite:", error);
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

//   return (
//     <div className="favorites-container">
//       <h2>Your Favorites</h2>
//       {favorites.length === 0 ? (
//         <p className="no-favorites">You have not favorited any posts yet.</p>
//       ) : (
//         <div className="favorites-grid">
//           {favorites.map((fav) => {
//             // Convert Unix timestamp (in seconds) to a human-readable date.
//             const formattedDate = new Date(fav.timestamp * 1000).toLocaleString();
//             return (
//               <div key={fav.postId} className="favorite-card">
//                 <h3 className="favorite-title">{fav.title}</h3>
//                 <p className="favorite-username">@{fav.username}</p>
//                 <p className="favorite-body">
//                   {fav.body.length > 50 ? fav.body.slice(0, 50) + "..." : fav.body}
//                 </p>
//                 <p className="favorite-timestamp">
//                   Favorited on: {formattedDate}
//                 </p>
//                 {!fav.archived ? (
//                   <button className="archive-btn" onClick={() => handleArchive(fav)}>
//                     <i className="fa-solid fa-archive"></i> Archive
//                   </button>
//                 ) : (
//                   <p className="archived-text">Archived</p>
//                 )}
//               </div>
//             );
//           })}
//         </div>
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

function Favorites() {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for controlling the CommentModal for a specific favorite post
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);

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

  // Separate active favorites (not archived) from archived ones.
  const activeFavorites = favorites.filter((fav) => !fav.archived);
  const archivedCount = favorites.filter((fav) => fav.archived).length;
  console.log(activeFavorites);

  return (
    <div className="favorites-container">
      <h2>Your Favorites</h2>
      {archivedCount > 0 && (
        <div className="archived-summary">
          ({archivedCount} archived)
        </div>
      )}
      {activeFavorites.length === 0 ? (
        <p className="no-favorites">You have not favorited any posts yet.</p>
      ) : (
        <div className="favorites-grid">
          {activeFavorites.map((fav) => {
            // Format timestamp (assumed to be in seconds)
            const formattedDate = new Date(fav.timestamp * 1000).toLocaleString();
            return (
              <div key={fav.postId} className="favorite-card">
                <h3 className="favorite-title">{fav.title}</h3>
                <p className="favorite-username">@{fav.username}</p>
                <p className="favorite-body">
                  {fav.body.length > 50 ? fav.body.slice(0, 50) + "..." : fav.body}
                </p>
                <p className="favorite-timestamp">
                  Favorited on: {formattedDate}
                </p>
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
                {!fav.archived ? (
                  <button className="archive-btn" onClick={() => handleArchive(fav)}>
                    <i className="fa-solid fa-archive"></i> Archive
                  </button>
                ) : (
                  <span className="archived-text">Archived</span>
                )}
              </div>
            );
          })}
        </div>
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


