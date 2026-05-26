"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-950 overflow-hidden font-sans">
      {/* Background Decorative Gradients using Global Brand Colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-emerald/10 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-blue/10 blur-[120px]" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-brand-violet/5 blur-[80px]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Loading Spinner */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <div className="absolute w-20 h-20 rounded-full border-2 border-brand-emerald/20 animate-ping duration-1000" />
          
          {/* Middle Spinning Ring */}
          <div className="w-16 h-16 rounded-full border-2 border-t-brand-emerald border-r-brand-blue border-b-brand-violet border-l-transparent animate-spin duration-700" />
          
          {/* Inner Logo Icon */}
          <div className="absolute p-2 bg-gray-900 border border-gray-800 rounded-full shadow-lg">
            <svg
              className="w-6 h-6 text-brand-emerald animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="mt-8 text-lg font-bold text-gray-200 tracking-wider">
          Initializing Lab<span className="text-brand-emerald">Log</span>...
        </h2>
        <p className="mt-2 text-xs text-gray-500 animate-pulse">
          Fetching secure portal credentials and loading inventory
        </p>
      </div>
    </div>
  );
}
