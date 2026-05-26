"use client";

import React from "react";
import Footer from "@/Components/Footer";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-gray-950 overflow-hidden font-sans">
      {/* Background Decorative Gradients using Global Brand Colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-emerald/10 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-blue/10 blur-[120px]" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-brand-violet/5 blur-[80px]" />

      <div className="relative z-10 w-full max-w-md px-6 pt-12 pb-4 sm:px-8 flex-grow flex flex-col justify-center items-center">
        {/* Warning Icon */}
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-brand-violet/10 border border-brand-violet/20 mb-6 shadow-[0_0_20px_rgba(139,92,246,0.15)] text-brand-violet animate-pulse">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-white tracking-tight text-center">
          404 - Not Found
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm text-gray-400 text-center leading-relaxed max-w-sm">
          You are mismatch with url. The page you are looking for does not exist or has been relocated.
        </p>

        {/* Warning Badge */}
        <div className="mt-6 px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-[11px] text-gray-500 tracking-wider uppercase">
          Invalid Navigation Request
        </div>
      </div>

      {/* Global Footer */}
      <Footer className="relative z-10 w-full pb-6" />
    </div>
  );
}
