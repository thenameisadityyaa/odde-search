import axios from "axios";

/**
 * Google Custom Search JSON API
 * Pagination uses start:
 * page1 -> 1
 * page2 -> 11
 * page3 -> 21 ...
 */
export async function searchWebCSE(query, page = 1) {
  const key = import.meta.env.VITE_GOOGLE_CSE_KEY;
  const cx = import.meta.env.VITE_GOOGLE_CSE_CX;

  if (!key || !cx) {
    throw new Error("Missing CSE env vars: VITE_GOOGLE_CSE_KEY or VITE_GOOGLE_CSE_CX");
  }

  const start = (page - 1) * 10 + 1;

  const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
    params: {
      q: query,
      key,
      cx,
      start,
      num: 10,
    },
  });

  return res.data;
}
