import React, { useState, useRef, useEffect } from "react";
import "../css/customaudio.css";

function CustomAudioPlayer({ src, coverPhoto, post }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const handleProgressClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  return (
    <div className="custom-audio-player2">
      {coverPhoto && (
        <div className="audio-cover-container">
          <p className="sec3-tag">{post.tags[0]}</p>
          <img src={coverPhoto} alt="Cover" className="audio-cover" />
          <div className="audio-controls-overlay">
            <button className="btn btn-link text-white play-pause-btn" onClick={togglePlay}>
                <i className={`fa ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
            </button>
            <div className="progress cu-progress mx-2" onClick={handleProgressClick} style={{ cursor: "pointer" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      )}
      {/* Hidden native audio element */}
      <audio ref={audioRef} src={src} controls={false} style={{ display: "none" }} />
    </div>
  );
}

export default CustomAudioPlayer;


