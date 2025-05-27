import React, { useEffect, useRef } from "react";
import YouTube from "react-youtube";

function VideoPlayer({ videoId, loopSettings, playerRef, loopEnabled, onDuration }) {
  const intervalRef = useRef(null);

  const opts = {
    height: "360",
    width: "640",
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;

    const checkDuration = () => {
      const duration = event.target.getDuration();
      if (duration > 0) {
        onDuration(duration);
        event.target.setPlaybackRate(loopSettings?.speed ?? 1.0);
      } else {
        setTimeout(checkDuration, 100);
      }
    };

    checkDuration();
  };

  useEffect(() => {
    if (!playerRef?.current || typeof playerRef.current.setPlaybackRate !== "function") return;
    playerRef.current.setPlaybackRate(loopSettings.speed);
  }, [loopSettings.speed]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!loopEnabled || !playerRef?.current || typeof playerRef.current.getCurrentTime !== "function") return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const currentTime = playerRef.current.getCurrentTime();
      if (currentTime >= loopSettings.end) {
        playerRef.current.seekTo(loopSettings.start);
      }
    }, 200);

    return () => clearInterval(intervalRef.current);
  }, [loopSettings.start, loopSettings.end, loopEnabled]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
      />
    </div>
  );
}

export default VideoPlayer;
