import axios from "axios";

export async function searchImages(query, page = 1, options = {}) {
  const host =
    import.meta.env.VITE_IMAGE_API_HOST ||
    "real-time-image-search.p.rapidapi.com";

  // ✅ support both naming styles
  const key =
    import.meta.env.VITE_IMAGE_API_KEY || import.meta.env.VITE_RAPIDAPI_KEY;

  if (!host || !key) {
    console.error("Missing Image API env vars", {
      VITE_IMAGE_API_HOST: import.meta.env.VITE_IMAGE_API_HOST,
      VITE_IMAGE_API_KEY: import.meta.env.VITE_IMAGE_API_KEY,
      VITE_RAPIDAPI_KEY: import.meta.env.VITE_RAPIDAPI_KEY,
    });

    throw new Error(
      "Missing Image API env vars. Please set VITE_IMAGE_API_KEY or VITE_RAPIDAPI_KEY."
    );
  }

  const perPage = options.perPage || 10;

  const res = await axios.get(`https://${host}/search`, {
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
  });

  return res.data;
}