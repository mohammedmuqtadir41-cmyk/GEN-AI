import { createBrowserRouter } from "react-router";
import { Login } from "./features/auth/pages/Login.jsx";
import { Register } from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/Components/protected.jsx";
import Home from "./features/interview/pages/homepage.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
]);
