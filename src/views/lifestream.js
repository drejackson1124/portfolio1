import React, { useRef, useEffect } from "react";
import * as IVSPlayer from "amazon-ivs-player";

function LiveStreamPlayer({ playbackUrl }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!IVSPlayer.isPlayerSupported) {
      console.error("IVS Player not supported");
      return;
    }

    console.log(IVSPlayer);
    const player = IVSPlayer.create();
    player.attachHTMLVideoElement(videoRef.current);
    player.load(playbackUrl);
    player.play();

    return () => {
      player.stop();
      player.detachHTMLVideoElement();
    };
  }, [playbackUrl]);

  return <video ref={videoRef} controls style={{ width: "100%" }} />;
}

export default LiveStreamPlayer;

