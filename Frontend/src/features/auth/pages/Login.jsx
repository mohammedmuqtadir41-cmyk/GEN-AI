import { Link } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export const Login = () => {

  const {loading, handleLogin} = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault();
    await handleLogin({email, password})
  };

  if(loading){
    return(<main><h1>Loading......</h1></main>)
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
            onChange={(e) => {setEmail(e.target.value)}}
              type="email"
              placeholder="john@example.com"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
              type="password"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
            Login
          </button>

          <p className="bottom-text">
            Don't have an account?
            <Link to={"/register"} className="auth-link"> Register</Link>
          </p>

        </form>

      </div>
    </main>
  );
};