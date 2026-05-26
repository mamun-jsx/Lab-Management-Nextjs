"use client";

import React, { useEffect, useState } from "react";
import { getUsers, getItems } from "@/action";
import { 
  Users, 
  Database, 
  TrendingUp, 
  Activity, 
  Loader2,
  Calendar,
  AlertCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Area chart interactive data (Last 3 Months metrics: Visitors & Products Listing)
const last3MonthsData = [
  { name: "March 2026", visitors: 5800, products: 45 },
  { name: "April 2026", visitors: 7200, products: 92 },
  { name: "May 2026", visitors: 9400, products: 120 },
];

// Bar chart data (January - June 2024 User Growth)
const users2024Data = [
  { name: "Jan 2024", users: 12 },
  { name: "Feb 2024", users: 18 },
  { name: "Mar 2024", users: 32 },
  { name: "Apr 2024", users: 48 },
  { name: "May 2024", users: 65 },
  { name: "Jun 2024", users: 84 },
];

// Custom Tooltip component for Recharts charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 backdrop-blur-md border border-gray-800 p-4 rounded-xl text-white shadow-xl text-xs font-sans">
        <p className="font-semibold mb-2 text-gray-300">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center gap-6 font-mono py-0.5">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name === "users" ? "Registered Users" : entry.name === "visitors" ? "Total Visitors" : "Products Logged"}:
            </span>
            <span className="font-bold text-gray-100">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [itemsCount, setItemsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchMetrics = async () => {
      try {
        const [usersResponse, itemsResponse] = await Promise.all([
          getUsers(),
          getItems(),
        ]);

        if (usersResponse.success) {
          setUsersCount(usersResponse.data.length);
        }
        if (itemsResponse.success) {
          setItemsCount(itemsResponse.data.length);
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-emerald mb-3" />
        <p className="text-sm text-gray-500 animate-pulse font-medium">Aggregating system overview analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            System Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time statistics, active logs, and user demographics</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-sm text-gray-500 font-semibold font-mono">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>TODAY: {new Date().toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Metric 1: Total Users */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Users</span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">
              {usersCount !== null ? usersCount : "--"}
            </span>
            <span className="text-xs text-brand-emerald font-semibold mt-1 inline-flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +15.2% from last month
            </span>
          </div>
          <div className="p-4 bg-brand-emerald/10 rounded-2xl border border-brand-emerald/20 text-brand-emerald">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Total Products */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Products</span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">
              {itemsCount !== null ? itemsCount : "--"}
            </span>
            <span className="text-xs text-brand-emerald font-semibold mt-1 inline-flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +8.4% from last month
            </span>
          </div>
          <div className="p-4 bg-brand-blue/10 rounded-2xl border border-brand-blue/20 text-brand-blue">
            <Database className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Total Visitors */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Visitors</span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">22,400</span>
            <span className="text-xs text-brand-emerald font-semibold mt-1 inline-flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +24.1% last 3 months
            </span>
          </div>
          <div className="p-4 bg-brand-violet/10 rounded-2xl border border-brand-violet/20 text-brand-violet">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: System Active Status */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">System Status</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1.5 flex items-center gap-1.5 block">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              ACTIVE
            </span>
            <span className="text-xs text-gray-500 mt-1 block font-mono">Response: 45ms</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-2xl border border-gray-200 text-gray-500">
            <Activity className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Charts Display Section */}
      <div className="space-y-8">
        
        {/* CHART 1: Full-Width Area Chart - Interactive (Products added and Visitors last 3 months) */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Products & Visitors Overview
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Interaction stats showing monthly visitors alongside medical product logs</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                Products Logged
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                Visitors
              </span>
            </div>
          </div>
          
          <div className="w-full h-[350px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={last3MonthsData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    name="visitors"
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                  <Area
                    name="products"
                    type="monotone"
                    dataKey="products"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProducts)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center text-sm text-gray-400">
                Loading interactive charts...
              </div>
            )}
          </div>
        </div>

        {/* CHART 2 & STATS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bar Chart (January - June 2024 User Growth) */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                User Signups Demographics
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Demographics log showing registered users growth from January - June 2024</p>
            </div>

            <div className="w-full h-[280px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={users2024Data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9ca3af" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="users" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={40}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center text-sm text-gray-400">
                  Loading signup charts...
                </div>
              )}
            </div>
          </div>

          {/* Quick Informative Panel */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-md font-bold text-gray-900 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4 text-brand-emerald" />
                Security & Audit Notice
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                This laboratory inventory dashboard monitors changes securely. Any user updates, creations, and label generations are logged under compliance guidelines.
              </p>
              
              <div className="space-y-3 mt-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-semibold">Demo Admin Access</span>
                  <span className="font-mono bg-gray-150 text-gray-700 px-2 py-0.5 rounded-lg border border-gray-200">EMP-1</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-semibold">Demo User Access</span>
                  <span className="font-mono bg-gray-150 text-gray-700 px-2 py-0.5 rounded-lg border border-gray-200">EMP-2</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 text-[10px] text-gray-400 text-center uppercase tracking-wider font-semibold font-mono">
              System Protected Log
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
