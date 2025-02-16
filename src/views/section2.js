import { useRef, useState } from "react";
import '../css/section2.css';

const Section2 = () => {
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
        setIsMuted(!isMuted);
        videoRef.current.muted = !isMuted;
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
        <div className="container p-0">
            <div className="row">
                <div className="col-12">
                    <div className="alert sec2-alert">Featured Artist <i class="fa-sharp fa-thin fa-heart pink"></i></div>
                </div>
            </div>
            <div className="section2-container">
            <div className="video-wrapper">
                <video 
                    ref={videoRef} 
                    src="https://upnextfm.s3.us-east-1.amazonaws.com/ads/actinup.mp4" 
                    autoPlay 
                    muted 
                    loop 
                    className="video-background"
                    onTimeUpdate={updateProgress}
                ></video>
                <div className="controls-overlay">
                    <div className="user-info">
                        {/* <i className="fa-thin fa-address-card"></i> */}
                        <span className="pink">@tommy</span>
                    </div>
                    <div className="control-buttons">
                        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
                        <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
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
        </div>
        </div>
    );
};

export default Section2;


