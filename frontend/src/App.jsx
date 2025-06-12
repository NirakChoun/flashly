import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import LandingLayout from "./layouts/LandingLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/register" element={<RegisterPage />} />
        </Route>

        {/* The layout depends on whether the user's login status */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
