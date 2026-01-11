import { webApi } from "./apiClient";

export async function searchGoogle(query, cursor = null) {
  const res = await webApi.get("/", {
    params: {
      query,
      limit: 10,
      related_keywords: true,
      ...(cursor ? { cursor } : {}),
    },
  });

  return res.data;
}
