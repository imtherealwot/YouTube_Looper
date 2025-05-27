import React, { useState, useEffect } from "react";
import { saveBookmark, loadBookmarks, deleteBookmark } from "../utils/cookieUtils";

function BookmarkList({ loopSettings, videoId, onLoadBookmark }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setBookmarks(loadBookmarks());
  }, []);

  const handleSave = () => {
    const name = prompt("Bookmark name?");
    if (!name) return;
    saveBookmark(name, videoId, loopSettings);
    setBookmarks(loadBookmarks());
  };

  const handleDelete = () => {
    if (!selected) return alert("Please select a bookmark to delete.");
    if (window.confirm(`Delete bookmark '${selected}'?`)) {
      deleteBookmark(selected);
      setBookmarks(loadBookmarks());
      setSelected("");
    }
  };

  const handleLoad = () => {
    const match = bookmarks.find((b) => b.name === selected);
    if (match) onLoadBookmark(match.videoId, match.settings);
  };

  return (
    <div className="mt-4 space-y-2">
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Bookmark
      </button>
      <div>
        <select className="w-full p-2 border mt-2" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">-- Select Bookmark --</option>
          {bookmarks.map((bm) => (
            <option key={bm.name} value={bm.name}>
              {bm.name} — {bm.settings.start}s–{bm.settings.end}s @ {bm.settings.speed}x
            </option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2">
        <button onClick={handleLoad} className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Load
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded w-full">
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookmarkList;
