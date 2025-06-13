import React from "react";
import { LoginForm } from "../components/LoginForm";
import { toast } from "react-toastify";

const LoginPage = () => {
  const loginUser = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();

      console.log("Login response:", data);
      console.log("Response status:", res.status);
      console.log("Cookies set:", document.cookie);

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
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
