import React from "react";
import { LoginForm } from "../components/LoginForm";
import { toast } from "react-toastify";

const LoginPage = () => {
  const loginUser = async (email, password) => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "https://flashly-api-adwh.onrender.com";
      const apiUrl = `${backendUrl}/auth/login`;

      const res = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();

      // Store token if cookies don't work
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        console.log("💾 Token stored in localStorage");
      }

      return data;
    } catch (error) {
      console.error("Login error: ", error);
      throw error;
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-900">
      <div className="w-full max-w-sm">
        <LoginForm loginUserSubmit={loginUser} />
      </div>
    </div>
  );
};

export default LoginPage;
