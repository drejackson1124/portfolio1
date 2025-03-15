import React from "react";
import '../css/customvideo.css';

function VideoComponent({ post }) {
  const { media, coverPhoto } = post;
  
  return (
<div className="custom-vid-container">
{/* <p className="sec3-tag">{post.tags[0]}</p> */}
<video
      src={media}
      controls
      controlsList="nodownload"
      style={{ height: "200px", objectFit:"cover" }}
      playsInline
      muted
      autoPlay
      loop
      poster={coverPhoto || undefined}
    >
      Your browser does not support the video tag.
    </video>
</div>
  );
}

export default VideoComponent;
