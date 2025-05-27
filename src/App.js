import React, { useState, useRef } from "react";
import VideoPlayer from "./components/VideoPlayer";
import LoopControls from "./components/LoopControls";
import BookmarkList from "./components/BookmarkList";
import "./App.css";

function extractVideoId(input) {
  try {
    const url = new URL(input);
    if (url.hostname === "youtu.be") return url.pathname.slice(1);
    if (url.searchParams.has("v")) return url.searchParams.get("v");
    return "";
  } catch {
    return input;
  }
}

function App() {
  const [videoInput, setVideoInput] = useState("https://www.youtube.com/watch?v=M7lc1UVf-VE");
  const [videoId, setVideoId] = useState("M7lc1UVf-VE");
  const [loopSettings, setLoopSettings] = useState({ start: 10.0, end: 20.0, speed: 1.0 });
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [videoDuration, setVideoDuration] = useState(100);
  const playerRef = useRef(null);

  const handleLoopChange = (newSettings) => {
    setLoopSettings({ ...newSettings });
  };

  const handlePlay = () => {
    const player = playerRef.current;
    if (!player || typeof player.seekTo !== "function") {
      console.warn("Player not ready.");
      return;
    }
    player.seekTo(loopSettings.start);
    player.playVideo();
  };

  const handlePause = () => {
    const player = playerRef.current;
    if (!player || typeof player.pauseVideo !== "function") return;
    player.pauseVideo();
  };

  const handleLoadVideo = () => {
    setVideoId(extractVideoId(videoInput));
  };

  const handleLoadBookmark = (bookmarkVideoId, settings) => {
    const newUrl = `https://www.youtube.com/watch?v=${bookmarkVideoId}`;
    setVideoInput(newUrl);
    setVideoId(bookmarkVideoId);
    setLoopSettings(settings);
  };

  const handleDuration = (duration) => {
    setVideoDuration(duration);
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">YouTube URL or Video ID</label>
        <div className="flex space-x-2">
          <input
            className="w-full p-2 border"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
          />
          <button onClick={handleLoadVideo} className="bg-blue-600 text-white px-4 py-2 rounded">
            Load
          </button>
        </div>
      </div>

      <LoopControls
        loopSettings={loopSettings}
        onChange={handleLoopChange}
        duration={videoDuration}
        playerRef={playerRef}
      />

      <div className="flex items-center space-x-4">
        <button onClick={handlePlay} className="bg-green-500 text-white px-4 py-2 rounded w-full">
          ▶️ Play
        </button>
        <button onClick={handlePause} className="bg-red-500 text-white px-4 py-2 rounded w-full">
          ⏸ Pause
        </button>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={loopEnabled}
            onChange={() => setLoopEnabled(!loopEnabled)}
          />
          <span>Loop</span>
        </label>
      </div>

      <VideoPlayer
        videoId={videoId}
        loopSettings={loopSettings}
        playerRef={playerRef}
        loopEnabled={loopEnabled}
        onDuration={handleDuration}
      />
      <BookmarkList
        loopSettings={loopSettings}
        videoId={videoId}
        onLoadBookmark={handleLoadBookmark}
      />
    </div>
  );
}

export default App;
