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
        const res = await fetch("/api/auth/profile", {
          method: "GET",
          credentials: "include", // Includes cookie in the request,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Authentication failed");
        }

        const data = await res.json();
        console.log(`data: ${data}`);

        if (!data) {
          throw new Error("No user data was found");
        }
        console.log("Authorization successfully");
        setIsAuthenticated(true);
      } catch (error) {
        console.log("Authorization failed: ", error);
        console.error("Authorization failed: ", error);
        setIsAuthenticated(false);
        toast.error("Authorization failed. Please log in again.");
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

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoutes;
