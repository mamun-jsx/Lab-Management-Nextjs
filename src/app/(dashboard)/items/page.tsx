"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-items`)
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

  if (loading) {
    return <div className="p-10 font-bold">Loading items...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Items</h1>
        <Link 
          href="/add-items" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add New Item
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3">Material Desc</th>
              <th className="px-6 py-3">Batch/Lot</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Expiry</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  No items found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 border-r">{item.materialDescription}</td>
                  <td className="px-6 py-4 border-r">{item.batchLot}</td>
                  <td className="px-6 py-4 border-r">{item.quantity}</td>
                  <td className="px-6 py-4 border-r">{new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/print/${item.id}`}
                      className="text-blue-600 hover:text-blue-800 font-bold underline"
                    >
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
  );
}
