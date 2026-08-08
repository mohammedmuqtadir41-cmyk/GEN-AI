import { Link, useNavigate } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export const Login = () => {
  const navigate = useNavigate();

  const { loading, handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Loading......</h1>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back 👋</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="john@example.com"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="bottom-text">
            Don't have an account?
            <Link to={"/register"} className="auth-link">
              {" "}
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};
