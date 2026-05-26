"use client";

import React, { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FlaskConical, 
  Database, 
  PlusCircle, 
  Users, 
  UserPlus,
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sidebar Context State
interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  const menuItems = [
    {
      title: "All Items",
      href: "/items",
      icon: Database,
    },
    {
      title: "Add New Item",
      href: "/add-items",
      icon: PlusCircle,
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
    },
    {
      title: "Create User",
      href: "/create-users",
      icon: UserPlus,
    },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <>
      {/* Mobile Hamburger Header (Visible only on mobile/tablet) */}
      <header className="md:hidden flex items-center justify-between bg-gray-900 text-white p-4 h-16 border-b border-gray-800 w-full print:hidden">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-brand-emerald animate-pulse" />
          <span className="font-bold text-lg tracking-wider">LabLog</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1 rounded-lg text-gray-400 hover:text-white focus:outline-none hover:bg-gray-800 transition-colors"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Overlay Background */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm print:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "bg-gray-900 text-gray-300 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out border-r border-gray-800 print:hidden",
          // Desktop sizing
          isCollapsed ? "md:w-20" : "md:w-64",
          // Mobile responsive placement (overlay drawer)
          "fixed md:static inset-y-0 left-0 z-50 md:z-auto h-full w-64 md:h-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 h-16 border-b border-gray-800 flex items-center justify-between">
          <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "md:justify-center md:w-full")}>
            <FlaskConical className="w-8 h-8 text-brand-emerald animate-pulse flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-bold text-xl text-white tracking-wider animate-in fade-in duration-300">
                Lab<span className="text-brand-emerald">Log</span>
              </span>
            )}
          </div>
          
          {/* Collapse Trigger (Desktop Only) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative font-medium text-sm",
                  isActive 
                    ? "bg-brand-emerald/10 text-white border-l-2 border-brand-emerald" 
                    : "hover:bg-gray-800/60 hover:text-gray-100"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-brand-emerald" : "text-gray-400 group-hover:text-gray-300")} />
                {!isCollapsed && (
                  <span className="animate-in fade-in duration-300">{item.title}</span>
                )}
                
                {/* Desktop Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-24 bg-gray-950 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-gray-800 z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (User info & Logout) */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/40">
          {/* User Profile Info */}
          <div className={cn("flex items-center gap-3 px-2 py-3 mb-2 rounded-xl", isCollapsed && "md:justify-center")}>
            <div className="w-8 h-8 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald font-semibold text-sm">
              <User className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden animate-in fade-in duration-300">
                <p className="text-xs font-semibold text-gray-200 truncate">Abdullah Al Mamun</p>
                <p className="text-[10px] text-gray-500 truncate">Lab Administrator</p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all font-medium text-sm group relative",
              isCollapsed && "md:justify-center"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Logout</span>}
            
            {/* Desktop Collapsed Tooltip */}
            {isCollapsed && (
              <div className="absolute left-24 bg-gray-950 text-red-400 text-xs px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-gray-800 z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
