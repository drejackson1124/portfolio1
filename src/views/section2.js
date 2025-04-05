// import React, { useState, useEffect, useRef, useContext } from "react";
// import helpers from "../helpers/helpers";
// import FavoriteHeart from "./favoriteheart";
// import "../css/section2.css";
// import { UserContext } from "../UserContext";
// import ProfileModal from "./profilemodal";
// import FullPageSpinner from "./spinner";

// // ControlledVideo: custom video that fills its container and has custom controls.
// // When played, it dispatches a global event so that other videos pause.
// const ControlledVideo = ({ post, autoplay }) => {
//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [profileModal, setProfileModal] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const { user } = useContext(UserContext);
//   const [profileModalLoading, setProfileModalLoading] = useState(false);

  // const openProfileModal = async (post) => {
  //   setProfileModalLoading(true);
  //   try {
  //     // Assuming helpers.getuser returns the full user details.
  //     const response = await helpers.getuser({ username: post.username });
  //     // Update the post object with additional details if needed.
  //     if (response.user && response.user.bio) {
  //       post.bio = response.user.bio;
  //     }

  //     if(response.user && response.user.profilepic){
  //       post.profilepic = response.user.profilepic
  //     }

  //     setSelectedPost(post);
  //     setProfileModal(true);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   } finally {
  //     setProfileModalLoading(false);
  //   }
  // }

  // const closeProfileModal = () => {
  //   setSelectedPost(null);
  //   setProfileModal(false);
  // };

//   // Listen for global "video-play" events to pause if another video starts playing.
//   useEffect(() => {
//     const handleGlobalPlay = (e) => {
//       if (e.detail !== videoRef.current) {
//         if (!videoRef.current.paused) {
//           videoRef.current.pause();
//           setIsPlaying(false);
//         }
//       }
//     };
//     window.addEventListener("video-play", handleGlobalPlay);
//     return () => {
//       window.removeEventListener("video-play", handleGlobalPlay);
//     };
//   }, []);

//   const handlePlay = async () => {
//     // Dispatch a custom event with the current video element as detail.
//     window.dispatchEvent(new CustomEvent("video-play", { detail: videoRef.current }));
//     try {
//       await videoRef.current.play();
//       setIsPlaying(true);
//     } catch (err) {
//       console.error("Play error:", err);
//     }
//   };

//   const handlePause = () => {
//     videoRef.current.pause();
//     setIsPlaying(false);
//   };

//   const togglePlay = () => {
//     if (videoRef.current.paused) {
//       handlePlay();
//     } else {
//       handlePause();
//     }
//   };

//   const toggleMute = () => {
//     const newMuted = !isMuted;
//     videoRef.current.muted = newMuted;
//     setIsMuted(newMuted);
//   };

//   return (
//     <div className="controlled-video-container">
//       <video
//         ref={videoRef}
//         src={post.media}
//         playsInline
//         loop
//         className="video-background"
//       ></video>
//       <div className="controls-overlay">
//         {/* Left side: play/pause, mute/unmute, and heart */}
//         <div className="controls-left">
//           <button className="play-btn" onClick={togglePlay}>
//             {isPlaying ? (
//               <i className="fa-solid fa-pause"></i>
//             ) : (
//               <i className="fa-solid fa-play"></i>
//             )}
//           </button>
//           {/* <button className="mute-btn" onClick={toggleMute}>
//             {isMuted ? (
//               <i className="fa-solid fa-volume"></i>
//             ) : (
//               <i className="fa-solid fa-volume-xmark"></i>
//             )}
//           </button> */}
//           <FavoriteHeart
//             postId={post.postId}
//             initiallyFavorited={post.favorited || false}
//           />
//         </div>

//         {/* Right side: username */}
//         <div className="controls-right">
//           <span className="video-username" onClick={() => { openProfileModal(post) }}>@{post.username}</span>
//         </div>
//       </div>
      // {profileModal && selectedPost && (
      //   <ProfileModal
      //     show={profileModal}
      //     onClose={closeProfileModal}
      //     currentUser={user}
      //     clickedUser={selectedPost}
      //   />
      // )}
      // {profileModalLoading && <FullPageSpinner />}
//     </div>
//   );
// };

// // LazyVideoComponent: Renders a placeholder until the video container is in view.
// const LazyVideoComponent = ({ post }) => {
//   const containerRef = useRef(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.25 }
//     );
//     if (containerRef.current) {
//       observer.observe(containerRef.current);
//     }
//     return () => {
//       if (containerRef.current) {
//         observer.unobserve(containerRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div ref={containerRef} style={{ width: "200px", height: "200px" }}>
//       {isVisible ? (
//         <ControlledVideo post={post} autoplay={false}/>
//       ) : (
//         <div style={{ background: "black", width: "100%", height: "100%" }} />
//       )}
//     </div>
//   );
// };

// const FeaturedVideo = ({ post }) => {
//   return (
//     <div className="featured-video-player">
//       <ControlledVideo post={post} autoplay={true}/>
//     </div>
//   );
// };

// function Section2() {
//   const [featuredVideo, setFeaturedVideo] = useState(null);
//   const [otherVideos, setOtherVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");


//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const response = await helpers.getvotd();
//         const data =
//           typeof response.body === "string"
//             ? JSON.parse(response.body)
//             : response.body;
//         const videoPosts = data.posts || [];
//         // Sort videos: first by descending favoritesCount, then by ascending timestamp.
//         const sortedVideos = videoPosts.sort((a, b) => {
//           const favA = Number(a.favoritesCount) || 0;
//           const favB = Number(b.favoritesCount) || 0;
//           const diff = favB - favA;
//           if (diff !== 0) return diff;
//           return Number(a.timestamp) - Number(b.timestamp);
//         });
//         setFeaturedVideo(sortedVideos[0] || null);
//         setOtherVideos(sortedVideos.slice(1));
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching video posts:", err);
//         setError("Error fetching video posts.");
//         setLoading(false);
//       }
//     };
//     fetchVideos();
//   }, []);

//   if (loading) {
//     return (
//       <div className="section2-container">
//         <div className="spinner">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="section2-container">
//         <p className="error">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="section2-container">
//       {featuredVideo && (
//         <div className="featured-video">
//           <h5 className="discussion-row-title sigmar-regular bold mt-3">
//             <span className="top5">Top 5</span> Videos ❤️‍🔥
//           </h5>
//           <h6>voted by the people</h6>
//           <FeaturedVideo post={featuredVideo} />
//         </div>
//       )}
//       {otherVideos.length > 0 && (
//         <div className="video-grid">
//           {otherVideos.slice(0, 4).map((video) => (
//             <div key={video.postId} className="video-card">
//               <div className="video-card-media">
//                 <LazyVideoComponent post={video} />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Section2;


import React, { useState, useEffect, useRef, useContext } from "react";
import helpers from "../helpers/helpers";
import FavoriteHeart from "./favoriteheart";
import VideoComponent from "./customvideo"; // not used directly here
import { UserContext } from "../UserContext";
import "../css/section2.css";
import ProfileModal from "./profilemodal";
import FullPageSpinner from "./spinner";
 
// ControlledVideo: custom video component that fills its container and
// shows custom controls at the bottom. It displays a flashing loading overlay
// until the video is fully loaded. When played, it pauses/mutes other videos.
const ControlledVideo = ({ post, autoplay }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useContext(UserContext);
  const [profileModalLoading, setProfileModalLoading] = useState(false);

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
  }

  const closeProfileModal = () => {
    setSelectedPost(null);
    setProfileModal(false);
  };

  // Listen for global "video-play" events so that if another video plays,
  // this one pauses.
  useEffect(() => {
    const handleGlobalPlay = (e) => {
      if (e.detail !== videoRef.current) {
        if (!videoRef.current.paused) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };
    window.addEventListener("video-play", handleGlobalPlay);
    return () => {
      window.removeEventListener("video-play", handleGlobalPlay);
    };
  }, []);

  const handleLoaded = () => {
    setIsLoaded(true);
  };

  const handlePlay = async () => {
    // Dispatch an event so other videos pause.
    window.dispatchEvent(new CustomEvent("video-play", { detail: videoRef.current }));
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Play error:", err);
    }
  };

  const handlePause = () => {
    videoRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (videoRef.current.paused) {
      handlePlay();
    } else {
      handlePause();
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <div className="controlled-video-container">
      <video
        ref={videoRef}
        src={post.media}
        playsInline
        loop
        className="video-background"
        onLoadedData={handleLoaded}
      ></video>
      {!isLoaded && (
        <div className="video-loading-overlay">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="controls-overlay">
        <div className="controls-left">
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? (
              <i className="fa-solid fa-pause"></i>
            ) : (
              <i className="fa-solid fa-play"></i>
            )}
          </button>
          <FavoriteHeart postId={post.postId} initiallyFavorited={post.favorited || false} />
        </div>
        <div className="controls-right">
          <span className="video-username" onClick={() => { openProfileModal(post)}}>@{post.username}</span>
        </div>
      </div>
      {profileModal && selectedPost && (
        <ProfileModal
          show={profileModal}
          onClose={closeProfileModal}
          currentUser={user}
          clickedUser={selectedPost}
        />
      )}
      {profileModalLoading && <FullPageSpinner />}
    </div>
  );
};

// LazyVideoComponent: Renders a placeholder until its container is in view.
const LazyVideoComponent = ({ post, autoplay = false }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "200px", height: "200px" }}>
      {isVisible ? (
        <ControlledVideo post={post} autoplay={autoplay} />
      ) : (
        <div style={{ background: "black", width: "100%", height: "100%" }} />
      )}
    </div>
  );
};

const FeaturedVideo = ({ post }) => {
  return (
    <div className="featured-video-player">
      <ControlledVideo post={post} autoplay={true} />
    </div>
  );
};

function Section2() {
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [otherVideos, setOtherVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await helpers.getvotd();
        const data =
          typeof response.body === "string"
            ? JSON.parse(response.body)
            : response.body;
        const videoPosts = data.posts || [];
        // Sort videos: first by descending favoritesCount, then by ascending timestamp.
        const sortedVideos = videoPosts.sort((a, b) => {
          const favA = Number(a.favoritesCount) || 0;
          const favB = Number(b.favoritesCount) || 0;
          const diff = favB - favA;
          if (diff !== 0) return diff;
          return Number(a.timestamp) - Number(b.timestamp);
        });
        setFeaturedVideo(sortedVideos[0] || null);
        setOtherVideos(sortedVideos.slice(1));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching video posts:", err);
        setError("Error fetching video posts.");
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="section2-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section2-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="section2-container">
      {featuredVideo && (
        <div className="featured-video">
        <h5 className="discussion-row-title sigmar-regular bold mt-3">
             <span className="top5">Top 5</span> Videos ❤️‍🔥
           </h5>
          <h6>voted by the people</h6>
          <FeaturedVideo post={featuredVideo} />
        </div>
      )}
      {otherVideos.length > 0 && (
        <div className="video-grid">
          {otherVideos.slice(0, 4).map((video) => (
            <div key={video.postId} className="video-card">
              <div className="video-card-media">
                <LazyVideoComponent post={video} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Section2;
