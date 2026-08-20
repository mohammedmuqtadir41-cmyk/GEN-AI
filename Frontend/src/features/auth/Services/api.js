import axios from "axios";

const api = axios.create({
  baseURL: "https://gen-ai-backend-i7y9.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("🚀 API REQUEST:", config.url);
    console.log("🔑 TOKEN FOUND:", token);
    console.log("📦 HEADERS BEFORE:", config.headers);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📦 HEADERS AFTER:", config.headers);

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;