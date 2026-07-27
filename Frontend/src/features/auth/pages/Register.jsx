import "../auth.form.scss";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export const Register = () => {
  const { loading, handleRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    await handleRegister({
      username,
      email,
      password,
    });
  };

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="subtitle">Join us today</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ahmed123"
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="john@example.com"
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>

            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
            />
          </div>

          <button type="submit">Create Account</button>

          <p className="bottom-text">
            Already have an account?
            <Link to={"/login"} className="auth-link">
              {" "}
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};
