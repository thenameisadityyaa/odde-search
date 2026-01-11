import axios from "axios";

// ✅ Web search API (google-search74)
export const webApi = axios.create({
  baseURL: "https://google-search74.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
    "X-RapidAPI-Host": "google-search74.p.rapidapi.com",
  },
});

// ✅ Image search API (real-time-image-search)
export const imageApi = axios.create({
  baseURL: "https://real-time-image-search.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
    "X-RapidAPI-Host": "real-time-image-search.p.rapidapi.com",
  },
});
