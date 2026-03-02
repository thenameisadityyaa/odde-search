import { clearRecentSearches } from "./storage";

const getPrefKey = (profileId) => `odde_prefs_${profileId || "default"}`;
const getSavedKey = (profileId) => `odde_saved_${profileId || "default"}`;
const CACHE_KEY = "odde_cache_v1";

export function clearPrefs(profileId) {
  localStorage.removeItem(getPrefKey(profileId));
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

export function clearSaved(profileId) {
  localStorage.removeItem(getSavedKey(profileId));
}

export function clearRecent(profileId) {
  clearRecentSearches(profileId);
}

export function resetAll(profileId) {
  clearPrefs(profileId);
  clearCache();
  clearSaved(profileId);
  clearRecent(profileId);
}
