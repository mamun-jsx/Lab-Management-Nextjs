"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, ShieldAlert, Phone, Lock, CheckCircle2, BadgeAlert, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { createUser } from "@/action";

// Define the fields for the registration form
interface CreateUserInputs {
  employeeName: string;
  employeeId: string;
  employeeEmail: string;
  mobileNumber: string;
  password:  string;
}

export default function CreateUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setIsAdmin(user.role === "ADMIN");
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      console.error(e);
      setIsAdmin(false);
    }
  }, []);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInputs>({
    defaultValues: {
      employeeName: "",
      employeeId: "",
      employeeEmail: "",
      mobileNumber: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: CreateUserInputs) => {
    setIsLoading(true);
    setSuccessMessage("");

    const formattedId = data.employeeId.startsWith("EMP-") ? data.employeeId : `EMP-${data.employeeId}`;
    const payload = {
      ...data,
      employeeId: formattedId
    };

    try {
      const result = await createUser(payload);
      
      if (result.success) {
        const msg = `User "${data.employeeName}" (ID: ${formattedId}) has been successfully created!`;
        setSuccessMessage(msg);
        toast.success(msg);
        
        // Clear form values after successful completion
        reset();
      } else {
        toast.error(result.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-[calc(100vh-4rem)] md:min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-sm text-gray-500">Checking permissions...</div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-[calc(100vh-4rem)] md:min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 mb-4 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6">
            Only laboratory administrators can create new user accounts.
          </p>
          <a
            href="/items"
            className="inline-flex justify-center items-center px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition-all"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] md:min-h-screen py-10 px-4 flex items-center justify-center font-sans animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gray-900 px-8 py-6 text-white flex items-center gap-4 border-b border-gray-800">
          <div className="p-3 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20">
            <User className="w-6 h-6 text-brand-emerald" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Create User Account</h1>
            <p className="text-xs text-gray-400 mt-1">Register new laboratory personnel accounts</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          
          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 text-emerald-800 text-sm flex items-start gap-3 animate-in slide-in-from-top duration-300">
              <CheckCircle2 className="w-5 h-5 text-brand-emerald flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-950">Success!</span>
                <p className="mt-1 text-xs text-emerald-700 leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            
            {/* Field 1: Employee Name */}
            <div>
              <label htmlFor="employeeName" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Employee Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="employeeName"
                  type="text"
                  placeholder="John Doe"
                  {...register("employeeName", { 
                    required: "Employee name is required." 
                  })}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm ${
                    errors.employeeName ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.employeeName && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5 animate-in fade-in duration-200">
                  <BadgeAlert className="w-3.5 h-3.5" />
                  {errors.employeeName.message}
                </p>
              )}
            </div>

            {/* Field 2: Employee ID */}
            <div>
              <label htmlFor="employeeId" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="absolute left-10 inset-y-0 flex items-center text-gray-400 font-semibold text-sm select-none">
                  EMP-
                </span>
                <input
                  id="employeeId"
                  type="text"
                  placeholder="1004"
                  {...register("employeeId", { 
                    required: "Employee ID is required.",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Employee ID must contain digits only."
                    }
                  })}
                  className={`w-full pl-20 pr-4 py-3 bg-gray-50/50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm ${
                    errors.employeeId ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.employeeId && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5 animate-in fade-in duration-200">
                  <BadgeAlert className="w-3.5 h-3.5" />
                  {errors.employeeId.message}
                </p>
              )}
            </div>

            {/* Field 3: Employee Email */}
            <div>
              <label htmlFor="employeeEmail" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Employee Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="employeeEmail"
                  type="email"
                  placeholder="name@company.com"
                  {...register("employeeEmail", { 
                    required: "Employee email address is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address."
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm ${
                    errors.employeeEmail ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.employeeEmail && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5 animate-in fade-in duration-200">
                  <BadgeAlert className="w-3.5 h-3.5" />
                  {errors.employeeEmail.message}
                </p>
              )}
            </div>

            {/* Field 4: Employee Mobile Number */}
            <div>
              <label htmlFor="mobileNumber" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Employee Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  id="mobileNumber"
                  type="tel"
                  placeholder="01712345678"
                  {...register("mobileNumber", { 
                    required: "Mobile number is required.",
                    pattern: {
                      value: /^[0-9+() \-]{8,15}$/,
                      message: "Please enter a valid mobile number (8-15 digits)."
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm ${
                    errors.mobileNumber ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.mobileNumber && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5 animate-in fade-in duration-200">
                  <BadgeAlert className="w-3.5 h-3.5" />
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>

            {/* Field 5: Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Account Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Password is required.",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters."
                    }
                  })}
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50/50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm ${
                    errors.password ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" : "border-gray-200"
                  }`}
                />
                
                {/* Password Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5 animate-in fade-in duration-200">
                  <BadgeAlert className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-8 bg-gradient-to-r from-brand-emerald to-brand-blue hover:from-brand-emerald/90 hover:to-brand-blue/90 text-white font-semibold rounded-xl shadow-lg shadow-brand-emerald/10 focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register User</span>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
