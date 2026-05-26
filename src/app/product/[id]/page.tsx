"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/Components/Footer";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-items/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((result) => {
          if (result.success) {
            setData(result.data);
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true));
    }
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-red-500 text-6xl mb-4">⚠️</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Item Not Found</h2>
          <p className="text-gray-500">We couldn't locate this medical material in our system or the code is invalid.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-pulse text-xl text-blue-600 font-semibold tracking-widest">
          VERIFYING...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col justify-between items-center">
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden border-t-8 border-blue-600">
          
          {/* Header Ribbon */}
          <div className="bg-blue-600 px-6 py-6 text-white text-center">
            <div className="text-xs uppercase tracking-[0.2em] opacity-80 font-bold mb-1">Authenticated Material</div>
            <h1 className="text-2xl font-black leading-tight tracking-wide">{data.materialDescription}</h1>
          </div>

          {/* Data Points */}
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Manufacturer</span>
              <span className="text-gray-900 font-bold text-right text-sm">JMI Syringe & Medical Devices Ltd.</span>
            </div>

            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Batch/Lot</p>
                <p className="text-gray-800 font-black text-lg">{data.batchLot}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Quantity</p>
                <p className="text-gray-800 font-black text-lg">{data.quantity} units</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Production Date</p>
                <p className="text-gray-800 font-bold">{new Date(data.prodDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Expiry Date</p>
                <p className="text-red-600 font-bold">{new Date(data.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-inner mt-4">
              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Content/GTIN</p>
                <p className="text-gray-600 font-mono text-xs">{data.contentCode}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Order Number</p>
                <p className="text-gray-600 font-mono text-xs">{data.orderNumber}</p>
              </div>
            </div>

          </div>

        </div>
      </div>
      <Footer className="w-full mt-8" />
    </div>
  );
}
