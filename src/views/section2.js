// import React, { useState, useEffect, useRef } from "react";
// import helpers from "../helpers/helpers";
// import VideoComponent from "./customvideo";
// import FavoriteHeart from "./favoriteheart";
// import "../css/section2.css";

// // Custom featured video component with custom playback controls
// const FeaturedVideo = ({ post }) => {
//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [isMuted, setIsMuted] = useState(true);
//   const [progress, setProgress] = useState(0);

//   const togglePlay = () => {
//     if (videoRef.current.paused) {
//       videoRef.current.play();
//       setIsPlaying(true);
//     } else {
//       videoRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   const toggleMute = () => {
//     const newMuted = !isMuted;
//     videoRef.current.muted = newMuted;
//     setIsMuted(newMuted);
//   };

//   const handleProgressChange = (e) => {
//     const newTime = e.target.value;
//     videoRef.current.currentTime = newTime;
//     setProgress(newTime);
//   };

//   const updateProgress = () => {
//     setProgress(videoRef.current.currentTime);
//   };

//   return (
//     <div className="featured-video-player">
//       <video 
//         ref={videoRef} 
//         src={post.media} 
//         autoPlay 
//         muted={isMuted} 
//         playsInline 
//         loop
//         className="video-background"
//         onTimeUpdate={updateProgress}
//       ></video>
//       <div className="controls-overlay">
//         <div className="user-info">
//           <span className="dodgerblue">@{post.username}</span>
//         </div>
//         <div className="control-buttons">
//           <button onClick={togglePlay}>{isPlaying ? <i class="fa-solid fa-pause"></i> : <i class="fa-solid fa-play"></i>}</button>
//           <button onClick={toggleMute}>{isMuted ? <i class="fa-solid fa-volume-xmark"></i> : <i class="fa-solid fa-volume"></i>}</button>
//         </div>
//         <input 
//           type="range" 
//           className="progress-bar seek-bar"
//           min="0" 
//           max={videoRef.current ? videoRef.current.duration : 100} 
//           value={progress} 
//           onChange={handleProgressChange}
//         />
//       </div>
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
//         // Sort videos by favoritesCount (descending) then by timestamp (ascending: oldest first)
//         const sortedVideos = videoPosts.sort((a, b) => {
//           const favA = Number(a.favoritesCount) || 0;
//           const favB = Number(b.favoritesCount) || 0;
//           const diff = favB - favA;
//           if (diff !== 0) return diff;
//           return Number(a.timestamp) - Number(b.timestamp);
//         });
//         // Set featured video as first in sorted list and the rest as other videos
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

//   // console.log(featuredVideo);

//   return (
//     <div className="section2-container">
//       {featuredVideo && (
//         <div className="featured-video">

//             <h5 className="discussion-row-title sigmar-regular mb-3">
//               TOP 5 <span className="dodgerblue">Curated</span> and 
//               <span className="dodgerblue"> picked</span> by the people.
//             </h5>

//           <FeaturedVideo post={featuredVideo} />
//         </div>
//       )}
//       {otherVideos.length > 0 && (
//         <div className="video-grid">
//           {otherVideos.slice(0,4).map((video) => (
//             <div key={video.postId} className="video-card">
//               <div className="video-card-media">
//                 <VideoComponent post={video}/>
//                 <div className="video-card-overlay">
//                   <FavoriteHeart postId={video.postId} initiallyFavorited={video.favorited || false} />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Section2;

import React, { useState, useEffect, useRef } from "react";
import helpers from "../helpers/helpers";
import VideoComponent from "./customvideo";
import FavoriteHeart from "./favoriteheart";
import "../css/section2.css";

// LazyVideoComponent: Renders a placeholder until the component is in view, then renders VideoComponent.
const LazyVideoComponent = ({ post }) => {
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
      { threshold: 0.25 } // Video loads when 25% visible
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "200px", height: "200px" }}>
      {isVisible ? (
        <VideoComponent post={post} />
      ) : (
        <div style={{ background: "black", width: "100%", height: "100%" }} />
      )}
    </div>
  );
};

const FeaturedVideo = ({ post }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    videoRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const updateProgress = () => {
    setProgress(videoRef.current.currentTime);
  };

  return (
    <div className="featured-video-player">
      <video 
        ref={videoRef} 
        src={post.media} 
        autoPlay 
        muted={isMuted} 
        playsInline 
        loop
        className="video-background"
        onTimeUpdate={updateProgress}
      ></video>
      <div className="controls-overlay">
        <div className="user-info">
          <span className="dodgerblue">@{post.username}</span>
        </div>
        <div className="control-buttons">
          <button onClick={togglePlay}>
            {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
          </button>
          <button onClick={toggleMute}>
            {isMuted ? <i className="fa-solid fa-volume-xmark"></i> : <i className="fa-solid fa-volume"></i>}
          </button>
        </div>
        <input 
          type="range" 
          className="progress-bar seek-bar"
          min="0" 
          max={videoRef.current ? videoRef.current.duration : 100} 
          value={progress} 
          onChange={handleProgressChange}
        />
      </div>
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
        // Sort videos by favoritesCount (descending) then by timestamp (ascending: oldest first)
        const sortedVideos = videoPosts.sort((a, b) => {
          const favA = Number(a.favoritesCount) || 0;
          const favB = Number(b.favoritesCount) || 0;
          const diff = favB - favA;
          if (diff !== 0) return diff;
          return Number(a.timestamp) - Number(b.timestamp);
        });
        // Set featured video as first in sorted list and the rest as other videos
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
          <h5 className="discussion-row-title sigmar-regular mb-3">
            TOP 5 <span className="dodgerblue">Curated</span> and 
            <span className="dodgerblue"> picked</span> by the people.
          </h5>
          <FeaturedVideo post={featuredVideo} />
        </div>
      )}
      {otherVideos.length > 0 && (
        <div className="video-grid">
          {otherVideos.slice(0, 4).map((video) => (
            <div key={video.postId} className="video-card">
              <div className="video-card-media">
                <LazyVideoComponent post={video} />
                <div className="video-card-overlay">
                  <FavoriteHeart 
                    postId={video.postId} 
                    initiallyFavorited={video.favorited || false} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Section2;

