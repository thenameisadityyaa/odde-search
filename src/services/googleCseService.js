import axios from "axios";

export async function searchWebCSE(query, page = 1, options = {}) {
  const key = import.meta.env.VITE_CSE_API_KEY;
  const cx = import.meta.env.VITE_CSE_ID;

  if (!key || !cx) {
    throw new Error("Missing Google CSE env vars");
  }

  const start = (page - 1) * (options.perPage || 10) + 1;

  const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
    params: {
      key,
      cx,
      q: query,
      start,
      num: options.perPage || 10,

      // SafeSearch in CSE
      safe: options.safe ? "active" : "off",

      // Region = country
      gl: options.region || "in",
    },
  });

  return res.data;
}
