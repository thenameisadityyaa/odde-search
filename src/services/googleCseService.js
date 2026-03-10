import axios from "axios";

export async function searchWebCSE(query, page = 1, options = {}) {
  const perPage = options.perPage || 10;
  
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/search`, {
      params: {
        q: query,
        type: options.searchType || "web",
        page,
        perPage,
        safe: options.safe,
        region: options.region,
        language: options.language
      },
    });
    return res.data;
  } catch (error) {
    const details = error.response?.data?.details || error.message;
    if (details.toLowerCase().includes("quota")) {
      throw new Error("Search quota exceeded for today. Please try again tomorrow.");
    }
    throw new Error("Backend API error: " + details);
  }
}
