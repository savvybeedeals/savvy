import React from "react";
import RegisterForm from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Join us today! Please fill out the required information below.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}