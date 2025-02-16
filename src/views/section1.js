import { useState, useEffect, useRef } from "react";
import helpers from "../helpers/helpers";
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../css/section1.css';

function Section1() {
    const [ads, setAds] = useState([]);
    const [playingIndex, setPlayingIndex] = useState(null); // Track which song is playing
    const [progress, setProgress] = useState({}); // Track progress of each audio
    const audioRefs = useRef([]);
    const seekBars = document.querySelectorAll(".seek-bar");

    seekBars.forEach(seekBar => {
        seekBar.addEventListener("input", function() {
            let progress = (this.value / this.max) * 100;
            this.style.backgroundSize = `${progress}% 100%`;
        });
    });


    useEffect(() => {
        const getAds = async () => {
            const result = await helpers.getAds();
            setAds(result);
        };
        getAds();
    }, []);

    const togglePlay = (index) => {
        const audio = audioRefs.current[index];
        if (!audio) return;

        if (playingIndex !== null && playingIndex !== index) {
            // Pause the currently playing audio if switching to a new one
            const currentAudio = audioRefs.current[playingIndex];
            if (currentAudio) {
                currentAudio.pause();
            }
        }

        if (audio.paused) {
            audio.play();
            setPlayingIndex(index);
        } else {
            audio.pause();
            setPlayingIndex(null);
        }
    };

    // const handleSeek = (index, e) => {
    //     const audio = audioRefs.current[index];
    //     if (audio) {
    //         const newTime = (e.target.value / 100) * audio.duration;
    //         audio.currentTime = newTime;
    //     }
    // };

    const handleSeek = (index, e) => {
        const audio = audioRefs.current[index];
        if (audio) {
            const newTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = newTime;
    
            // Update the seek bar background
            const progressPercent = (newTime / audio.duration) * 100;
            e.target.style.background = `linear-gradient(to right, #ff4500 ${progressPercent}%, #ffcc00 ${progressPercent}%)`;
        }
    };
    

    // const updateProgress = (index) => {
    //     const audio = audioRefs.current[index];
    //     if (audio) {
    //         const progressPercent = (audio.currentTime / audio.duration) * 100 || 0;
    //         setProgress((prev) => ({ ...prev, [index]: progressPercent }));
    //     }
    // };
    const updateProgress = (index) => {
        const audio = audioRefs.current[index];
        if (audio) {
            const progressPercent = (audio.currentTime / audio.duration) * 100 || 0;
            setProgress((prev) => ({ ...prev, [index]: progressPercent }));
    
            // Update the seek bar background
            const seekBar = document.querySelectorAll(".seek-bar")[index];
            if (seekBar) {
                seekBar.style.background = `linear-gradient(to right, #ff4500 ${progressPercent}%, #ffcc00 ${progressPercent}%)`;
            }
        }
    };

    useEffect(() => {
        ads.forEach((_, index) => {
            const seekBar = document.querySelectorAll(".seek-bar")[index];
            if (seekBar) {
                seekBar.style.background = `linear-gradient(to right, #ff4500 0%, #ffcc00 0%)`;
            }
        });
    }, [ads]);
    

    if (!ads.length) {
        return <h1>Nothing to display</h1>;
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2, 
        slidesToScroll: 2,
        arrows: true,
        autoplay: false,
        autoplaySpeed: 4000,
        swipe: true
    };

    // return (
    //     <div>
    //         <div className="row">
    //             <div className="col-12">
    //                 <div className="alert sec1-alert">Playlist Worthy <i class="fa-thin fa-music"></i></div>
    //             </div>
    //         </div>
    //         <div className="slider-container p-0">
    //             <Slider {...settings}>
    //                 {ads.map((ad, index) => (
    //                     <div key={index} className="ad-box">
    //                         <i class="fa-thin fa-address-card sec1-usercard"></i>
    //                         <img src={ad.media_photo} alt={ad.artist} className="ad-image" />
    //                         <div className="overlay">
    //                             <h3 className="artist-name">{ad.handle}</h3>
    //                             <div className="custom-audio-player">
    //                                 <button className="play-pause" onClick={() => togglePlay(index)}>
    //                                     <i className={`fa ${playingIndex === index ? "fa-pause" : "fa-play"}`}></i>
    //                                 </button>
    //                                 <input 
    //                                     type="range" 
    //                                     className="seek-bar" 
    //                                     min="0" 
    //                                     max="100"
    //                                     step="1"
    //                                     value={progress[index] || 0}
    //                                     onChange={(e) => handleSeek(index, e)}
    //                                 />
    //                             </div>
    //                             {ad.media_music && (
    //                                 <audio 
    //                                     ref={(el) => (audioRefs.current[index] = el)}
    //                                     className="audio-player"
    //                                     onTimeUpdate={() => updateProgress(index)}
    //                                     onEnded={() => setPlayingIndex(null)}
    //                                 >
    //                                     <source src={ad.media_music} type="audio/mpeg" />
    //                                 </audio>
    //                             )}
    //                         </div>
    //                     </div>
    //                 ))}
    //             </Slider>
    //         </div>
    //     </div>
    // );
    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <div className="alert sec1-alert">Playlist Worthy <i className="fa-thin fa-music"></i></div>
                </div>
            </div>
            <div className="slider-container p-0">
                <Slider {...settings}>
                    {ads.map((ad, index) => (
                        <div key={index} className="ad-box">
                            {/* Address card positioned in the top-right corner */}
                            <div className="sec1-usercard-container">
                                <i className="fa-thin fa-address-card sec1-usercard"></i>
                            </div>
                            <img src={ad.media_photo} alt={ad.artist} className="ad-image" />
                            <div className="overlay">
                                <h3 className="artist-name">{ad.handle}</h3>
                                <div className="custom-audio-player">
                                    <button className="play-pause" onClick={() => togglePlay(index)}>
                                        <i className={`fa ${playingIndex === index ? "fa-pause" : "fa-play"}`}></i>
                                    </button>
                                    <input 
                                        type="range" 
                                        className="seek-bar" 
                                        min="0" 
                                        max="100"
                                        step="1"
                                        value={progress[index] || 0}
                                        onChange={(e) => handleSeek(index, e)}
                                    />
                                </div>
                                {ad.media_music && (
                                    <audio 
                                        ref={(el) => (audioRefs.current[index] = el)}
                                        className="audio-player"
                                        onTimeUpdate={() => updateProgress(index)}
                                        onEnded={() => setPlayingIndex(null)}
                                    >
                                        <source src={ad.media_music} type="audio/mpeg" />
                                    </audio>
                                )}
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
    
}

export default Section1;




