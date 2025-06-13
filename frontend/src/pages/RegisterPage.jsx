import React from "react";
import { RegisterForm } from "../components/RegisterForm";

const RegisterPage = () => {
  const registerUser = async (newUser) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        // Throw error with the backend message
        throw new Error(data.error || data.msg || "Registration failed");
      }

      return data;
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
