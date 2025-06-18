import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../src/components/Spinner";

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log("🔍 Checking authentication...");

        // Call backend directly (no /api prefix needed)
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL ||
          "https://flashly-api-adwh.onrender.com";
        const apiUrl = `${backendUrl}/auth/profile`;

        console.log("📡 Calling:", apiUrl);

        const res = await fetch(apiUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("📡 Response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.log("❌ Response error:", errorText);
          throw new Error(`Authentication failed: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ User data received:", data);

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
