import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://google-search74.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
    "X-RapidAPI-Host": "google-search74.p.rapidapi.com",
  },
});
