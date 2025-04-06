// import React, {useRef, useState} from "react";
// import '../css/customvideo.css';
// import FavoriteHeart from "./favoriteheart";

// function VideoComponent({ post }) {
//   const { media, coverPhoto } = post;
//   const videoRef = useRef(null);
//   const [isMuted, setIsMuted] = useState(true);


//   const toggleMute = () => {
//     const newMuted = !isMuted;
//     videoRef.current.muted = newMuted;
//     setIsMuted(newMuted);
//   };
  
//   return (
// <div className="custom-vid-container">
// {/* <p className="sec3-tag">{post.tags[0]}</p> */}
// <video
//       ref={videoRef}
//       src={media}
//       controlsList="nodownload"
//       style={{ height: "200px", objectFit:"cover" }}
//       playsInline
//       muted
//       autoPlay
//       loop
//       poster={coverPhoto || undefined}
//     >
//       Your browser does not support the video tag.
// </video>
//       <div className="controls-overlay">
//         <div className="controls-left">
//           <button className="mute-btn" onClick={toggleMute}>
//             {isMuted ? (
//               <i className="fa-solid fa-volume-xmark"></i>
//             ) : (
//               <i className="fa-solid fa-volume"></i>
//             )}
//           </button>
//           <FavoriteHeart postId={post.postId} initiallyFavorited={post.favorited || false} />
//         </div>
//         <div className="controls-right">
//           <span className="video-username" onClick={() => { }}>
//             @{post.username}
//           </span>
//         </div>
//       </div>
// </div>
//   );
// }

// export default VideoComponent;


import React, { useRef, useState, useEffect, useContext } from "react";
import "../css/customvideo.css";
import FavoriteHeart from "./favoriteheart";
import { UserContext } from "../UserContext";

function VideoComponent({ post }) {
  const { media, coverPhoto, username, postId, favorited } = post;
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Listen for global "video-unmute" events so that if another video is unmuted,
  // this video forces itself to be muted.
  useEffect(() => {
    const handleGlobalUnmute = (e) => {
      if (e.detail !== videoRef.current) {
        if (!videoRef.current.muted) {
          videoRef.current.muted = true;
          setIsMuted(true);
        }
      }
    };
    window.addEventListener("video-unmute", handleGlobalUnmute);
    return () => {
      window.removeEventListener("video-unmute", handleGlobalUnmute);
    };
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    // If unmuting this video, dispatch an event so that all other videos remain muted.
    if (!newMuted) {
      window.dispatchEvent(new CustomEvent("video-unmute", { detail: videoRef.current }));
    }
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <div className="custom-vid-container">
      <video
        ref={videoRef}
        src={media}
        controlsList="nodownload"
        style={{ height: "200px", objectFit: "cover" }}
        playsInline
        muted
        autoPlay
        loop
        poster={coverPhoto || undefined}
      >
        Your browser does not support the video tag.
      </video>
      <div className="controls-overlay">
        <div className="controls-left">
          <button className="mute-btn" onClick={toggleMute}>
            {isMuted ? (
              <i className="fa-solid fa-volume-xmark"></i>
            ) : (
              <i className="fa-solid fa-volume"></i>
            )}
          </button>
          <FavoriteHeart postId={postId} initiallyFavorited={favorited || false} />
        </div>
        <div className="controls-right">
          <span className="video-username" onClick={() => {}}>
            @{username}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoComponent;
