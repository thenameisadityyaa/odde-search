import axios from "axios";

export async function searchWebCSE(query, page = 1, options = {}) {
  // ✅ support both naming styles
  const key =
    import.meta.env.VITE_CSE_API_KEY || import.meta.env.VITE_GOOGLE_CSE_KEY;

  const cx = import.meta.env.VITE_CSE_ID || import.meta.env.VITE_GOOGLE_CSE_CX;

  if (!key || !cx) {
    console.error("Missing Google CSE env vars", {
      VITE_CSE_API_KEY: import.meta.env.VITE_CSE_API_KEY,
      VITE_CSE_ID: import.meta.env.VITE_CSE_ID,
      VITE_GOOGLE_CSE_KEY: import.meta.env.VITE_GOOGLE_CSE_KEY,
      VITE_GOOGLE_CSE_CX: import.meta.env.VITE_GOOGLE_CSE_CX,
    });

    throw new Error(
      "Missing Google CSE env vars. Please set VITE_CSE_API_KEY + VITE_CSE_ID (or VITE_GOOGLE_CSE_KEY + VITE_GOOGLE_CSE_CX)"
    );
  }

  const perPage = options.perPage || 10;
  const start = (page - 1) * perPage + 1;

  try {
    const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key,
        cx,
        q: query,
        start,
        num: Math.min(perPage, 10),
        safe: options.safe ? "active" : "off",
        gl: options.region || "in",
        searchType: options.searchType || undefined, // 'image' for images
        lr: options.language ? `lang_${options.language}` : undefined,
      },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 403) {
      console.error("Google CSE 403 Forbidden: Quota exceeded or invalid key/CX", error.response.data);
    }
    throw error;
  }
}
