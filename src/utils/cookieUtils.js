export function saveBookmark(name, videoId, settings) {
  const all = loadBookmarks();
  const updated = [...all.filter(b => b.name !== name), { name, videoId, settings }];
  document.cookie = "ytBookmarks=" + encodeURIComponent(JSON.stringify(updated)) + "; path=/";
}

export function loadBookmarks() {
  const match = document.cookie.match(/(?:^|;)\s*ytBookmarks=([^;]*)/);
  if (!match) return [];
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return [];
  }
}

export function deleteBookmark(name) {
  const all = loadBookmarks();
  const filtered = all.filter(b => b.name !== name);
  document.cookie = "ytBookmarks=" + encodeURIComponent(JSON.stringify(filtered)) + "; path=/";
}
