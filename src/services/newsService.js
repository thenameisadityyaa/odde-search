import axios from "axios";

export async function searchNews(query, page = 1, options = {}) {
  const key = import.meta.env.VITE_GNEWS_API_KEY;

  if (!key) throw new Error("Missing env: VITE_GNEWS_API_KEY");

  const perPage = options.perPage || 10;

  try {
    const res = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: query,
        token: key,
        lang: "en",
        country: options.region || "in",
        max: perPage,
        page,
      },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 403) {
      console.error("GNews API 403 Forbidden: Token issue or plan limit", error.response.data);
    }
    throw error;
  }
}
