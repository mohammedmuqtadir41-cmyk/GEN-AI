import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, register, getMe } from "../Services/auth.api";


export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      const nextUser = data?.user ?? data;
      setUser(nextUser && typeof nextUser === "object" ? nextUser : null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      const nextUser = data?.user ?? data;
      setUser(nextUser && typeof nextUser === "object" ? nextUser : null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getAndSetUser = async () => {
      try {
        const data = await getMe();

        if (!isMounted) return;

        const nextUser = data?.user ?? data;
        setUser(nextUser && typeof nextUser === "object" ? nextUser : null);
      } catch (err) {
        console.error("Failed to restore session", err);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getAndSetUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, handleLogin, handleLogout, handleRegister };
};
