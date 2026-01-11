import { apiClient } from "./apiClient";

/**
 * Google Search (RapidAPI)
 * baseURL: https://google-search74.p.rapidapi.com
 * endpoint: GET /
 *
 * Supports:
 * - query
 * - limit
 * - related_keywords
 * - cursor (for pagination)
 */
export async function searchGoogle(query, cursor = null) {
  const res = await apiClient.get("/", {
    params: {
      query,
      limit: 10,
      related_keywords: true,
      ...(cursor ? { cursor } : {}),
    },
  });

  return res.data;
}
