"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Printer, Plus, Loader2, Database, Calendar, Layers, Hash } from "lucide-react";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-items`, { headers })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setItems(result.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Title Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Database className="w-7 h-7 text-brand-emerald" />
            Inventory Items
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage registered medical materials and packaging logs</p>
        </div>
        <Link 
          href="/add-items" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-emerald to-brand-blue hover:from-brand-emerald/90 hover:to-brand-blue/90 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md text-sm transition-all focus:outline-none"
        >
          <Plus className="w-4 h-4" />
          Add New Item
        </Link>
      </div>

      {loading ? (
        /* Premium Loading Skeleton */
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow overflow-hidden p-8 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-brand-emerald mb-4" />
          <p className="text-sm text-gray-500 animate-pulse">Loading medical materials log, please wait...</p>
        </div>
      ) : (
        /* Responsive User Table Card */
        <div className="bg-white rounded-2xl border border-gray-200 shadow overflow-hidden">
          <div className="min-w-full overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 font-bold">
                <tr>
                  <th className="px-6 py-4">Material Description</th>
                  <th className="px-6 py-4">Batch / Lot</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400 font-medium">
                      No materials found in database. Click "Add New Item" to create one.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-55/30 transition-colors">
                      {/* Material Description */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-emerald/10 text-brand-emerald font-bold flex items-center justify-center text-sm shadow-inner uppercase">
                            {item.materialDescription.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 leading-snug">{item.materialDescription}</div>
                            <div className="text-xs text-gray-400 mt-0.5 font-mono">GTIN: {item.contentCode}</div>
                          </div>
                        </div>
                      </td>

                      {/* Batch / Lot */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className="font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-gray-200">
                          {item.batchLot}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                          <Layers className="w-4 h-4 text-gray-400" />
                          {item.quantity.toLocaleString()} units
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(item.expiryDate).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-right">
                        <Link
                          href={`/print/${item.id}`}
                          className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/10"
                        >
                          <Printer className="w-3.5 h-3.5 text-gray-500" />
                          Print Label
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
