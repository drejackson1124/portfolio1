// import React, { useState, useEffect, useContext } from "react";
// import helpers from "../helpers/helpers";
// import "../css/section4.css";
// import CommentModal from "./commentmodal";
// import { UserContext } from "../UserContext";
// import { Link } from "react-router-dom";

// function Section4() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showCommentModal, setShowCommentModal] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const { user } = useContext(UserContext);

//   // If a user isn't logged in, we store the postId here to show "Please sign in."
//   const [loveErrorForPost, setLoveErrorForPost] = useState(null);

//   // Filter state
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     const fetchTextPosts = async () => {
//       try {
//         const response = await helpers.gettextpost({});
//         const data =
//           typeof response.body === "string"
//             ? JSON.parse(response.body)
//             : response.body;
//         setPosts(data.posts || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching text posts:", err);
//         setError("Error fetching text posts.");
//         setLoading(false);
//       }
//     };
//     fetchTextPosts();
//   }, []);

//   const openCommentModal = (post) => {
//     console.log(post);
//     setSelectedPost(post);
//     setShowCommentModal(true);
//   };

//   const closeCommentModal = () => {
//     setShowCommentModal(false);
//     setSelectedPost(null);
//   };

//   // Callback to update the posts state when a comment is added.
//   const handleCommentAdded = (postId, newCommentObj) => {
//     setPosts((prevPosts) =>
//       prevPosts.map((post) => {
//         if (post.postId === postId) {
//           const updatedComments = post.comments
//             ? [...post.comments, newCommentObj]
//             : [newCommentObj];
//           return { ...post, comments: updatedComments };
//         }
//         return post;
//       })
//     );
//   };

//   // When the user clicks the heart icon
//   const handleHeartClick = async (post) => {
//     if (!user) {
//       // If user isn't logged in, set the error for this specific post
//       setLoveErrorForPost(post.postId);
//       return;
//     }

//     // If the user is logged in, handle the "like" logic here
//     console.log("User is logged in, post can be liked:", post.postId);
//     let obj = {username: user.username, postId: post.postId};
//     const result = await helpers.toggleFavs(obj);
//     if(result.statusCode === 200){

//     } else {
//       console.log(result);
//     }
//   };

//   // Filter logic (assumes primaryTag is at post.tags[0])
//   const filteredPosts =
//     filter === "All"
//       ? posts
//       : posts.filter(
//           (post) =>
//             post.primaryTag === filter
//         );

//   if (loading) {
//     return (
//       <div className="section4-container">
//         <div className="spinner">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="section4-container">
//         <p className="error">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="section4-wrapper">
      
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

//       <div className="section4-container">
//         {filteredPosts.length === 0 ? (
//           <p className="no-posts text-center">
//             No posts available for the selected filter 
//           </p>
//         ) : (
//           filteredPosts.map((post) => (
//             <div key={post.postId} className="text-post-card">
              
//               <div className="text-post-tags">
                
//                 {post.primaryTag}
//               </div>

              
//               <h2 className="text-post-title mb-0 mt-2">
//                 {post.title.slice(0, 20)}
//               </h2>
//               <p className="text-post-body">
//                 {post.body.length > 50
//                   ? post.body.slice(0, 50) + "..."
//                   : post.body}
//                 <br />
//                 <button className="btn btn-sm post-usr-btn mt-1">
//                   @{post.username}
//                 </button>
//               </p>

              
//               <button
//                 className="sec4-comment-btn mb-2"
//                 onClick={() => openCommentModal(post)}
//               >
//                 <i className="fa-solid fa-comment"></i>{" "}
//                 {post.comments
//                   ? <span className="small-comments-text">{post.comments.length}</span>
//                   : <span className="small-comments-text"></span>}
//               </button>

              
//               <i
//                 className="fa-regular fa-heart ms-3"
//                 onClick={() => handleHeartClick(post)}
//               ></i>

              
//               {loveErrorForPost === post.postId && (
//                 <div className="love-error-message">
//                   Please <Link to='signin'>sign in</Link> to like this post.
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>

      
//       {showCommentModal && selectedPost && (
//         <CommentModal
//           show={showCommentModal}
//           onClose={closeCommentModal}
//           post={selectedPost}
//           onCommentAdded={handleCommentAdded}
//         />
//       )}
//     </div>
//   );
// }

// export default Section4;



import React, { useState, useEffect, useContext } from "react";
import helpers from "../helpers/helpers";
import "../css/section4.css";
import CommentModal from "./commentmodal";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

function Section4() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
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

  // When the user clicks the heart icon
  const handleHeartClick = async (post) => {
    if (!user) {
      // If user isn't logged in, set the error for this specific post
      setLoveErrorForPost(post.postId);
      return;
    }
    // Clear any love error for this post
    setLoveErrorForPost(null);
    let obj = { username: user.username, postId: post.postId };
    const result = await helpers.toggleFavs(obj);
    if (result.statusCode === 200) {
      // Update favorites locally
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

  // Filter logic (assumes primaryTag is at post.tags[0] or stored as post.primaryTag)
  const filteredPosts =
    filter === "All"
      ? posts
      : posts.filter((post) => post.primaryTag === filter);


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
        </select>
      </div>

      <div className="section4-container">
        {filteredPosts.length === 0 ? (
          <p className="no-posts text-center">
            No posts available for the selected filter 
          </p>
        ) : (
          filteredPosts.map((post) => {
            // Check if the current user has favorited this post
            const isFavorited =
              user &&
              post.favorites &&
              post.favorites.includes(user.username);

            
            return (
              <div key={post.postId} className="text-post-card">
                <div className="text-post-tags">
                  {post.primaryTag}
                </div>

                <h2 className="text-post-title mb-0 mt-2">
                  {post.title.slice(0, 20)}
                </h2>
                <p className="text-post-body">
                  {post.body.length > 50
                    ? post.body.slice(0, 50) + "..."
                    : post.body}
                  <br />
                  <button className="btn btn-sm post-usr-btn mt-1">
                    @{post.username}
                  </button>
                </p>

                <button
                  className="sec4-comment-btn mb-2"
                  onClick={() => openCommentModal(post)}
                >
                  <i className="fa-solid fa-comment"></i>{" "}
                  {post.comments
                    ? <span className="small-comments-text">{post.comments.length}</span>
                    : <span className="small-comments-text"></span>}
                </button>

                {isFavorited ? (
                  <i
                    className="fa-solid fa-heart ms-3"
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => handleHeartClick(post)}
                  ></i>
                ) : (
                  <i
                    className="fa-regular fa-heart ms-3"
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

      {showCommentModal && selectedPost && (
        <CommentModal
          show={showCommentModal}
          onClose={closeCommentModal}
          post={selectedPost}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}

export default Section4;



