import React from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 print:hidden shadow-lg">
        <div className="p-6 text-2xl font-bold border-b border-gray-800 tracking-wider">
          LabLog
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link 
            href="/items" 
            className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            All Items
          </Link>
          <Link 
            href="/add-items" 
            className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Add New Item
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-y-auto print:overflow-visible">
        {children}
      </main>
    </div>
  );
}
