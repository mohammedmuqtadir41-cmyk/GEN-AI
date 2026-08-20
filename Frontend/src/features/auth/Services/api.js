import axios from "axios";

const api = axios.create({
  baseURL: "https://gen-ai-backend-i7y9.onrender.com/api",
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("🚀 API REQUEST:", config.url);
    console.log("🔑 TOKEN FOUND:", token);

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      "📦 FINAL AUTH HEADER:",
      config.headers?.Authorization
    );

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;