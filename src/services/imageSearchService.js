import axios from "axios";

export async function searchImages(query, page = 1, options = {}) {
  const host = import.meta.env.VITE_IMAGE_API_HOST;
  const key = import.meta.env.VITE_IMAGE_API_KEY;

  if (!host || !key) throw new Error("Missing Image API env vars");

  const perPage = options.perPage || 10;

  const res = await axios.get(
    "https://real-time-image-search.p.rapidapi.com/search",
    {
      params: {
        query,
        limit: perPage,
        page,
        safe_search: options.safe ? "on" : "off",
        region: options.region || "in",
      },
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": key,
      },
    }
  );

  return res.data;
}
