import { clearRecentSearches } from "./storage";

const PREF_KEY = "odde_prefs_v1";
const CACHE_KEY = "odde_cache_v1";
const SAVED_KEY = "odde_saved_v1";

export function clearPrefs() {
  localStorage.removeItem(PREF_KEY);
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

export function clearSaved() {
  localStorage.removeItem(SAVED_KEY);
}

export function clearRecent() {
  clearRecentSearches();
}

export function resetAll() {
  clearPrefs();
  clearCache();
  clearSaved();
  clearRecent();
}
