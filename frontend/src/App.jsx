import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import HomePage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainLayout from "./layouts/MainLayout";
import FlashcardsPage from "./pages/FlashcardsPage";
import FlashcardPage from "./pages/FlashcardPage";
import GeneratePage from "./pages/GeneratePage";
import AddFlashcardPage from "./pages/AddFlashcardPage";
import EditFlashcardPage from "./pages/EditFlashcardPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Landing layout pages */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        {/* Main layout pages (after login) */}
        <Route path="/home" element={<MainLayout />}>
          <Route path="flashcards" element={<FlashcardsPage />} />
          <Route path="flashcards/flashcard1" element={<FlashcardPage />} />
          <Route path="generate" element={<GeneratePage />} />
          <Route path="add" element={<AddFlashcardPage />} />
          <Route path="edit" element={<EditFlashcardPage />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
