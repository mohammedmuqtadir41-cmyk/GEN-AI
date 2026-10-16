
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context";
import { InterviewProvider } from "./features/interview/interview.context";
import SoffitBackground from "./SoffitBackground";
import "./SoffitGlobal.css";

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <div className="soffit-app-shell">
          <SoffitBackground />
          <div className="soffit-app-content">
            <RouterProvider router={router} />
          </div>
        </div>
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
