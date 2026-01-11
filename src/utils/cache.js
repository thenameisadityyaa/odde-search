const PREFIX = "odde_cache_v1";

/**
 * Make cache key unique per:
 * type (web/images/news)
 * query string
 * page number
 */
export function makeCacheKey(type, query, page = 1) {
  return `${PREFIX}:${type}:${query.toLowerCase().trim()}:p${page}`;
}

/**
 * Store cache with TTL (expiry)
 */
export function setCache(key, data, ttlMs = 1000 * 60 * 10) {
  // default TTL = 10 minutes
  const payload = {
    expiry: Date.now() + ttlMs,
    data,
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

/**
 * Get cache if valid
 */
export function getCache(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const payload = JSON.parse(raw);
    if (!payload?.expiry || Date.now() > payload.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return payload.data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Optional helper
 */
export function clearAllCache() {
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith(PREFIX)) localStorage.removeItem(k);
  });
}
