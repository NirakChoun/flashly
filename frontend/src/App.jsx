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
import HomeLayout from "./layouts/HomeLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";
import StudySetPage from "./pages/StudySetPage";
import AddStudySetPage from "./pages/AddStudySetPage";
import AddFlashcardPage from "./pages/AddFlashcardPage";
import EditStudySetPage from "./pages/EditStudySetPage";
import EditFlashcardPage from "./pages/EditFlashcardPage";
import GeneratePage from "./pages/GeneratePage";
import PreviewGeneratedStudySetPage from "./pages/PreviewGeneratedStudySetPage";

import NotFoundPage from "./pages/NotFoundPage";

// Utils
import ProtectedRoutes from "../utils/ProtectedRoutes";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<HomeLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="studysets/:studySetId" element={<StudySetPage />} />
            <Route path="studysets/create" element={<AddStudySetPage />} />
            <Route
              path="studysets/:studySetId/edit"
              element={<EditStudySetPage />}
            />{" "}
            <Route
              path="studysets/:studySetId/add-flashcards"
              element={<AddFlashcardPage />}
            />
            <Route
              path="studysets/:studySetId/edit-flashcards"
              element={<EditFlashcardPage />}
            />{" "}
            <Route path="generate" element={<GeneratePage />} />{" "}
            <Route
              path="studysets/:studySetId/preview"
              element={<PreviewGeneratedStudySetPage />}
            />{" "}
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
