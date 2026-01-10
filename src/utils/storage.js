const KEY = "odde_recent_searches";

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query) {
  if (!query) return;

  const trimmed = query.trim();
  if (!trimmed) return;

  const existing = getRecentSearches();

  // Remove duplicates
  const filtered = existing.filter((x) => x.toLowerCase() !== trimmed.toLowerCase());

  // Add to top and limit to 8
  const updated = [trimmed, ...filtered].slice(0, 8);

  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function clearRecentSearches() {
  localStorage.removeItem(KEY);
}
