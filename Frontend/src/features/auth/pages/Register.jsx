import "../auth.form.scss";
import { Link } from "react-router";

export const Register = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="auth-page">
      <div className="auth-card">

        <h1>Create Account</h1>
        <p className="subtitle">
          Join us today
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Ahmed123"
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="john@example.com"
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="••••••••"
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="••••••••"
            />
          </div>

          <button type="submit">
            Create Account
          </button>

          <p className="bottom-text" >
            Already have an account?
            <Link to={"/login"} className="auth-link"> Login</Link>
          </p>

        </form>

      </div>
    </main>
  );
};