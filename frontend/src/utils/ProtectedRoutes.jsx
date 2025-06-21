import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log("🔍 Checking authentication...");

        // Check for URL token first (from OAuth)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");

        if (urlToken) {
          localStorage.setItem("auth_token", urlToken);
          // Clean URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          console.log("🎉 Token found in URL and stored");
        }

        // Get token from localStorage
        const token = localStorage.getItem("auth_token");

        if (!token) {
          console.log("❌ No token found");
          setIsAuthenticated(false);
          return;
        }

        const backendUrl =
          import.meta.env.VITE_BACKEND_URL ||
          "https://flashly-api-adwh.onrender.com";
        const apiUrl = `${backendUrl}/auth/profile`;

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Use Bearer token
        };

        const res = await fetch(apiUrl, {
          method: "GET",
          headers: headers,
        });

        if (!res.ok) {
          localStorage.removeItem("auth_token"); // Clear invalid token
          throw new Error(`Authentication failed: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Authentication successful with Bearer token");

        setIsAuthenticated(true);
      } catch (error) {
        console.log("❌ Authorization failed:", error.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  console.log(`isAuthenticated: ${isAuthenticated}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner loading={true} />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
