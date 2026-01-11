import { apiClient } from "./apiClient";

/**
 * ✅ Correct for google-search74.p.rapidapi.com
 * Endpoint: GET https://google-search74.p.rapidapi.com/
 * Params: query, limit, related_keywords
 */
export async function searchGoogle(query) {
  const res = await apiClient.get("/", {
    params: {
      query: query,
      limit: 10,
      related_keywords: true,
    },
  });

  return res.data;
}
