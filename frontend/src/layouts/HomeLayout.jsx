import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeLayout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL ||
          "https://flashly-api-adwh.onrender.com";
        const token = localStorage.getItem("auth_token");

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${backendUrl}/auth/profile`, {
          method: "GET",
          headers: headers,
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("✅ User data fetched:", userData);
          setUser(userData.user); // ✅ Make sure to access user property
        } else {
          console.log("❌ Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isLoggedIn={true} user={user} />
      <Outlet />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default HomeLayout;
