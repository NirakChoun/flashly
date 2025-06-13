import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LandingLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isLoggedIn={false} />
      <Outlet />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default LandingLayout;
