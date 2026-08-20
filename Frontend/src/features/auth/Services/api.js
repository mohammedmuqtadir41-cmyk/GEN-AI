import axios from "axios";

// Create one Axios instance for all backend API requests.
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ,

  // Allows cookies to be sent if needed.
  withCredentials: true,
});

// Automatically attach JWT to every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Add the JWT only when a token exists.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;