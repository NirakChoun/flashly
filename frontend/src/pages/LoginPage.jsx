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

      console.log("🔄 Calling login:", apiUrl);

      const res = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 Login response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      console.log("✅ Login successful:", data);
      console.log("🍪 Cookies set:", document.cookie);

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
