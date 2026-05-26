"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, DashboardSidebar } from "@/Components/DashboardSidebar";
import Footer from "@/Components/Footer";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-950 text-white font-sans">
        <div className="animate-pulse text-xs text-gray-500 font-semibold tracking-widest font-mono">
          CHECKING SESSION...
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden w-screen">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto print:overflow-visible flex flex-col justify-between h-full w-full">
          <div className="flex-grow">
            {children}
          </div>
          <Footer className="border-t border-gray-200 bg-white" />
        </main>
      </div>
    </SidebarProvider>
  );
}
