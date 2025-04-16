import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingLayout = () => {
  return (
    <>
      <Navbar isLanding={true} />
      <Outlet />
      <Footer />
    </>
  );
};

export default LandingLayout;
