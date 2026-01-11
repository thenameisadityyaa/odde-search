import axios from "axios";

export async function searchNews(query, page = 1, options = {}) {
  const key = import.meta.env.VITE_GNEWS_API_KEY;

  if (!key) throw new Error("Missing env: VITE_GNEWS_API_KEY");

  const perPage = options.perPage || 10;

  const res = await axios.get("https://gnews.io/api/v4/search", {
    params: {
      q: query,
      token: key,
      lang: "en",
      country: options.region || "in",
      max: perPage,
      page,

      // SafeSearch not officially supported in GNews like Google,
      // but we keep it for future expandability.
    },
  });

  return res.data;
}
