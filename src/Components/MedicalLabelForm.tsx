"use client";
import React from "react";

export default function MedicalLabelForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());
    const data = { ...rawData, quantity: Number(rawData.quantity) };
    console.log("Form Data:", data);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (result.success && result.data && result.data.id) {
        alert("Item added successfully!");
        e.currentTarget.reset();
      } else {
        alert("Failed to add item: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the item.");
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
          Order Entry Form
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UNICEF Material Description - Full Width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 uppercase mb-1">
              Unicef Material Description
            </label>
            <input
              name="materialDescription"
              type="text"
              placeholder="SYRINGE,A-D,0.5ML,JMI,LA/BOX-100"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Quantity & Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 uppercase mb-1">
              Quantity
            </label>
            <input
              name="quantity"
              type="number"
              placeholder="72000"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 uppercase mb-1">
              Content (GTIN)
            </label>
            <input
              name="contentCode"
              type="text"
              placeholder="08944000597028"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Batch & Dates */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 uppercase mb-1">
              Batch / Lot
            </label>
            <input
              name="batchLot"
              type="text"
              placeholder="FP6002001"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Prod Date
              </label>
              <input
                name="prodDate"
                type="date"
                className="w-full p-2 border rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Expiry
              </label>
              <input
                name="expiryDate"
                type="date"
                className="w-full p-2 border rounded text-sm"
                required
              />
            </div>
          </div>

          {/* Part No & Order No */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 uppercase mb-1">
              Cust Part No.
            </label>
            <input
              name="custPartNo"
              type="text"
              placeholder="S0782441"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 uppercase mb-1">
              Order Number
            </label>
            <input
              name="orderNumber"
              type="text"
              placeholder="45215488-010"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
        >
          Generate Label & Save to Database
        </button>
      </form>
    </div>
  );
}
