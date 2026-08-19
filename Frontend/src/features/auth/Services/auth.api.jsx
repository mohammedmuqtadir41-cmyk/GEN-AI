import axios from "axios";

const api = axios.create({
  baseURL: "https://gen-ai-backend-i7y9.onrender.com/api/auth",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function logout() {
  try {
    const response = await api.get("/logout");
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getMe() {
  try {
    const response = await api.get("/get-me");
    return response.data;
  } catch (err) {
    console.log("getMe failed:", err.response?.status, err.response?.data);
    throw err;
  }
}
