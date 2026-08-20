import api from "./api";

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/auth/get-me");

    return response.data;
  } catch (err) {
    console.error(
      "getMe failed:",
      err.response?.status,
      err.response?.data,
    );

    throw err;
  }
}

export async function logout() {
  try {
    const response = await api.get("/auth/logout");

    localStorage.removeItem("token");

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}