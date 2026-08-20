import axios from "axios";

const api = axios.create({
  baseURL: "https://gen-ai-backend-i7y9.onrender.com/api",
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      if (typeof config.headers?.set === "function") {
        // Axios v1 AxiosHeaders — this actually registers the
        // header in the internal map the adapter serializes from.
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        // Fallback for plain-object headers (older axios / edge cases)
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;