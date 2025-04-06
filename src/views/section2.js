import React, { useState, useEffect, useRef, useContext } from "react";
import helpers from "../helpers/helpers";
import FavoriteHeart from "./favoriteheart";
import { UserContext } from "../UserContext";
import ProfileModal from "./profilemodal";
import FullPageSpinner from "./spinner";
import "../css/section2.css";
import VideoComponent from "./customvideo";

// ControlledVideo: custom video component that fills its container and has custom controls.
// It uses a loading overlay until the video has loaded.
const ControlledVideo = ({ post, autoplay }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useContext(UserContext);

  // Global event listener: pause this video if another video plays.
  useEffect(() => {
    const handleGlobalPlay = (e) => {
      if (e.detail !== videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
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
      <VideoComponent post={post}/>
      {/* {!isLoaded && (
        <div className="video-loading-overlay">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )} */}
      {/* <div className="controls-overlay">
        <div className="controls-left">
          <button className="mute-btn" onClick={toggleMute}>
            {isMuted ? (
              <i className="fa-solid fa-volume-xmark"></i>
            ) : (
              <i className="fa-solid fa-volume"></i>
            )}
          </button>
          <FavoriteHeart postId={post.postId} initiallyFavorited={post.favorited || false} />
        </div>
        <div className="controls-right">
          <span className="video-username" onClick={() => { }}>
            @{post.username}
          </span>
        </div>
      </div> */}
    </div>
  );
};

// LazyVideoComponent: Renders a placeholder until the video container is in view.
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
      { threshold: 0.25 }
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
        <ControlledVideo post={post} />
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
          <h5 className="discussion-row-title sigmar-regular mb-3 mt-3">
            Powered by the People, Top 5
          </h5>
          <FeaturedVideo post={featuredVideo} />
          {/* <VideoComponent post={featuredVideo}/> */}
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
