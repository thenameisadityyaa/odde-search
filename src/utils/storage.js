const getPrefix = (profileId) => `odde_recent_${profileId || "default"}`;

export function getRecentSearches(profileId) {
  try {
    const key = getPrefix(profileId);
    let data = localStorage.getItem(key);
    if (!data && (!profileId || profileId === "default")) {
      data = localStorage.getItem("odde_recent_searches");
    }
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query, profileId) {
  if (!query) return;

  const trimmed = query.trim();
  if (!trimmed) return;

  const existing = getRecentSearches(profileId);
  const filtered = existing.filter(
    (x) => x.toLowerCase() !== trimmed.toLowerCase()
  );

  const updated = [trimmed, ...filtered].slice(0, 8);
  localStorage.setItem(getPrefix(profileId), JSON.stringify(updated));
}

export function clearRecentSearches(profileId) {
  localStorage.removeItem(getPrefix(profileId));
}
