import axios from "axios";

export async function searchNews(query, page = 1, options = {}) {
  const perPage = options.perPage || 10;

  try {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
    const res = await axios.get(`${baseUrl}/api/search`, {
      params: {
        q: query,
        type: "news",
        page,
        perPage,
        region: options.region,
      },
    });
    return res.data;
  } catch (error) {
    const details = error.response?.data?.details || error.message;
    throw new Error("Backend News API error: " + details);
  }
}
