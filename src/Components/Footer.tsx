import React from "react";

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <>
      <div className="w-full h-[1px] bg-gray-200" />
      <footer
        className={`py-4 px-6 bg-gray-900 text-center text-xs text-gray-500 print:hidden flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2 ${className}`}
      >
        <span>© {new Date().getFullYear()} LabLog. All rights reserved.</span>
        <span className="hidden sm:inline text-gray-700">|</span>
        <span>
          Developed by{" "}
          <a
            href="https://github.com/mamun-jsx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-emerald hover:underline hover:text-brand-emerald/85 transition-colors font-semibold"
          >
            Abdullah Al Mamun
          </a>
        </span>
      </footer>
    </>
  );
}
