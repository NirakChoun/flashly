import React from "react";
import { RegisterForm } from "../components/RegisterForm";

const RegisterPage = () => {
  const registerUser = async (newUser) => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "https://flashly-api-adwh.onrender.com";
      const apiUrl = `${backendUrl}/auth/register`;

      console.log("🔄 Calling register:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      console.log("📡 Register response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-900">
      <div className="w-full max-w-sm">
        <RegisterForm registerUserSubmit={registerUser} />
      </div>
    </div>
  );
};

export default RegisterPage;
