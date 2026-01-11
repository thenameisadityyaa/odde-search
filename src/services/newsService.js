import axios from "axios";

/**
 * GNews Search API
 * Response: { totalArticles, articles: [...] }
 * Each article: { title, description, url, image, publishedAt, source: { name, url } }
 */
export async function searchNews(query, page = 1) {
  const key = import.meta.env.VITE_GNEWS_API_KEY;

  if (!key) {
    throw new Error("Missing env: VITE_GNEWS_API_KEY");
  }

  const res = await axios.get("https://gnews.io/api/v4/search", {
    params: {
      q: query,
      token: key,
      lang: "en",
      country: "in",
      max: 10,
      page,
    },
  });

  return res.data;
}
