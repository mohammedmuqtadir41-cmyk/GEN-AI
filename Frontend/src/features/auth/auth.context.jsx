import { createContext, useEffect, useState } from "react";
import { getMe } from "./Services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      // No token means there is no session to restore.
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMe();

        const nextUser = data?.user ?? data;

        setUser(
          nextUser && typeof nextUser === "object"
            ? nextUser
            : null
        );
      } catch (error) {
        console.error("Failed to restore session:", error);

        // Remove invalid/expired token.
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};