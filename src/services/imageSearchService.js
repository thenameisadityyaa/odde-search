import { imageApi } from "./apiClient";

/**
 * Real-Time Image Search API
 * GET /search?query=beach&limit=10&page=1...
 */
export async function searchImages(query, page = 1) {
  const res = await imageApi.get("/search", {
    params: {
      query,
      limit: 18,
      page, // ✅ pagination
      safe_search: "off",
      region: "us",
    },
  });

  return res.data;
}
