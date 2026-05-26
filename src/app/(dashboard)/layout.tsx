import React from "react";
import { SidebarProvider, DashboardSidebar } from "@/Components/DashboardSidebar";
import Footer from "@/Components/Footer";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden w-screen">
        {/* Shadcn-style Sidebar */}
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
