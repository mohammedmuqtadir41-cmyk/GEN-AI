import { createContext, useEffect, useState } from "react";
import { getMe } from "./Services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Loading for login/register/logout actions
  const [loading, setLoading] = useState(false);

  // Loading only while checking an existing session
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      // No token means there is no session to restore.
      if (!token) {
        setInitializing(false);
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

        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setInitializing(false);
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
        initializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};