import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {
  login,
  logout,
  register,
} from "../Services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  const {
    user,
    setUser,
    loading,
    setLoading,
    initializing,
  } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const data = await login({
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      const nextUser = data?.user ?? null;

      setUser(nextUser);

      return data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({
    username,
    email,
    password,
  }) => {
    setLoading(true);

    try {
      const data = await register({
        username,
        email,
        password,
      });

      const nextUser = data?.user ?? data;

      setUser(
        nextUser && typeof nextUser === "object"
          ? nextUser
          : null
      );

      return data;
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    initializing,
    handleLogin,
    handleLogout,
    handleRegister,
  };
};