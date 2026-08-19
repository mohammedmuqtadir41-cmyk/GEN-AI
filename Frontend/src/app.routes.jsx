import { createBrowserRouter } from "react-router";
import { Login } from "./features/auth/pages/Login.jsx";
import { Register } from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/Components/Protected.jsx";
import Home from "./features/interview/pages/homepage.jsx";
import Interview from "./features/interview/pages/Interview.jsx";
import InterviewSession from "./features/interview/pages/InterviewSession.jsx";
import InterviewResults from "./features/interview/pages/InterviewResults.jsx";

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
  {
    path: "/interview",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },

  {
    path: "/interview/:interviewId/session",
    element: (
      <Protected>
        <InterviewSession />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId/session/:sessionId/results",
    element: (
      <Protected>
        <InterviewResults />
      </Protected>
    ),
  },
]);
