import React from "react";
import { RegisterForm } from "../components/RegisterForm";
import { toast } from "react-toastify";

const RegisterPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-900">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
