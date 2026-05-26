"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { 
  FlaskConical, 
  Layers, 
  QrCode, 
  Calendar, 
  Inbox, 
  Hash, 
  PlusCircle, 
  Loader2,
  FileText
} from "lucide-react";

export default function MedicalLabelForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());
    const data = { ...rawData, quantity: Number(rawData.quantity) };
    console.log("Form Data:", data);

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-items`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result.success && result.data && result.data.id) {
        toast.success("Item added successfully!");
        e.currentTarget.reset();
      } else {
        toast.error("Failed to add item: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the item.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] md:min-h-screen py-10 px-4 flex items-center justify-center font-sans animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gray-900 px-8 py-6 text-white flex items-center gap-4 border-b border-gray-800">
          <div className="p-3 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20">
            <FlaskConical className="w-6 h-6 text-brand-emerald animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Order Entry Form</h1>
            <p className="text-xs text-gray-400 mt-1">Generate labels and save medical material to database</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* UNICEF Material Description - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Unicef Material Description
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <input
                    name="materialDescription"
                    type="text"
                    placeholder="SYRINGE,A-D,0.5ML,JMI,LA/BOX-100"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Quantity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <input
                    name="quantity"
                    type="number"
                    placeholder="72000"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Content (GTIN) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Content (GTIN)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <input
                    name="contentCode"
                    type="text"
                    placeholder="08944000597028"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Batch / Lot */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Batch / Lot
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <input
                    name="batchLot"
                    type="text"
                    placeholder="FP6002001"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Prod Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      name="prodDate"
                      type="date"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Expiry
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      name="expiryDate"
                      type="date"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Cust Part No. */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Cust Part No.
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Hash className="w-5 h-5" />
                  </div>
                  <input
                    name="custPartNo"
                    type="text"
                    placeholder="S0782441"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Order Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Order Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Hash className="w-5 h-5" />
                  </div>
                  <input
                    name="orderNumber"
                    type="text"
                    placeholder="45215488-010"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-sm"
                    required
                  />
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-8 bg-gradient-to-r from-brand-emerald to-brand-blue hover:from-brand-emerald/90 hover:to-brand-blue/90 text-white font-semibold rounded-xl shadow-lg shadow-brand-emerald/10 focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Saving & Generating Label...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Generate Label & Save to Database</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
