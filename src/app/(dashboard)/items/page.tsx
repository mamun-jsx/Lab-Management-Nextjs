"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { 
  Printer, 
  Plus, 
  Loader2, 
  Database, 
  Calendar, 
  Layers, 
  Edit2, 
  Trash2, 
  X,
  FileText,
  QrCode,
  Inbox,
  Hash,
  Search
} from "lucide-react";
import { getItems, updateItem, deleteItem } from "@/action";

interface UserProfile {
  role: string;
}

interface UpdateItemInputs {
  materialDescription: string;
  quantity: number;
  contentCode: string;
  batchLot: string;
  prodDate: string;
  expiryDate: string;
  custPartNo: string;
  orderNumber: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Update Modal State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateItemInputs>();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getItems();
      if (response.success) {
        setItems(response.data);
      } else {
        toast.error(response.message || "Failed to load items");
      }
    } catch (err: any) {
      console.error("Error fetching items:", err);
      toast.error("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const isAdmin = currentUser?.role === "ADMIN";

  // Modal Open Handler
  const handleOpenUpdateModal = (item: any) => {
    setSelectedItem(item);
    
    // Format dates to YYYY-MM-DD for date input display
    const formattedProdDate = item.prodDate ? new Date(item.prodDate).toISOString().split('T')[0] : "";
    const formattedExpiryDate = item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : "";

    setValue("materialDescription", item.materialDescription);
    setValue("quantity", item.quantity);
    setValue("contentCode", item.contentCode);
    setValue("batchLot", item.batchLot);
    setValue("prodDate", formattedProdDate);
    setValue("expiryDate", formattedExpiryDate);
    setValue("custPartNo", item.custPartNo);
    setValue("orderNumber", item.orderNumber);

    setIsUpdateModalOpen(true);
  };

  // Submit Updated Item
  const onUpdateSubmit = async (data: UpdateItemInputs) => {
    if (!selectedItem) return;
    setIsSubmittingUpdate(true);

    try {
      const response = await updateItem(selectedItem.id, {
        ...data,
        quantity: Number(data.quantity)
      });

      if (response.success) {
        toast.success("Product details updated successfully!");
        setIsUpdateModalOpen(false);
        reset();
        fetchItems();
      } else {
        toast.error(response.message || "Failed to update product");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the product details.");
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  // Delete Item Handler
  const handleDeleteItem = async (id: string, description: string) => {
    if (!window.confirm(`Are you sure you want to delete "${description}"?`)) {
      return;
    }

    try {
      const response = await deleteItem(id);
      if (response.success) {
        toast.success("Product deleted successfully!");
        fetchItems();
      } else {
        toast.error(response.message || "Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the product.");
    }
  };

  // Dynamic client-side filtering logic
  const filteredItems = items.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      (item.contentCode && item.contentCode.toLowerCase().includes(query)) ||
      (item.batchLot && item.batchLot.toLowerCase().includes(query)) ||
      (item.materialDescription && item.materialDescription.toLowerCase().includes(query))
    );
  });

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
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-emerald to-brand-blue hover:from-brand-emerald/90 hover:to-brand-blue/90 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md text-sm transition-all focus:outline-none font-sans"
        >
          <Plus className="w-4 h-4" />
          Add New Item
        </Link>
      </div>

      {/* Dynamic Search Box */}
      {!loading && (
        <div className="relative max-w-md mb-6 font-sans">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search by GTIN (Content Code) or Batch / Lot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800 shadow-sm"
          />
        </div>
      )}

      {loading ? (
        /* Premium Loading Skeleton */
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow overflow-hidden p-8 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-brand-emerald mb-4" />
          <p className="text-sm text-gray-500 animate-pulse">Loading medical materials log, please wait...</p>
        </div>
      ) : (
        /* Responsive Table Card */
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
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400 font-medium">
                      No materials found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
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
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/print/${item.id}`}
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/10"
                          >
                            <Printer className="w-3.5 h-3.5 text-gray-500" />
                            Print
                          </Link>
                          
                          <button
                            onClick={() => handleOpenUpdateModal(item)}
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/10"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Update
                          </button>
                          
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteItem(item.id, item.materialDescription)}
                              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100/70 border border-red-100 hover:border-red-200 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UPDATE PRODUCT MODAL */}
      {isUpdateModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gray-900 px-6 py-5 text-white flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Edit2 className="w-5 h-5 text-brand-emerald animate-pulse" />
                <span className="font-bold text-lg">Update Product Details</span>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800 p-1.5 rounded-lg transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit(onUpdateSubmit)} className="p-6 space-y-4" noValidate>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Unicef Material Description
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      {...register("materialDescription", { required: "Description is required" })}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                    />
                  </div>
                  {errors.materialDescription && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.materialDescription.message}</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Quantity
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      {...register("quantity", { required: "Quantity is required" })}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                    />
                  </div>
                  {errors.quantity && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.quantity.message}</p>
                  )}
                </div>

                {/* Content Code (GTIN) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Content (GTIN)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      {...register("contentCode", { required: "GTIN is required" })}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                    />
                  </div>
                  {errors.contentCode && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.contentCode.message}</p>
                  )}
                </div>

                {/* Batch / Lot */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Batch / Lot
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Inbox className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      {...register("batchLot", { required: "Batch/Lot is required" })}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                    />
                  </div>
                  {errors.batchLot && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.batchLot.message}</p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Prod Date
                    </label>
                    <input
                      type="date"
                      {...register("prodDate", { required: "Required" })}
                      className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      {...register("expiryDate", { required: "Required" })}
                      className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                    />
                  </div>
                </div>

                {/* Cust Part No */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Cust Part No.
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      {...register("custPartNo", { required: "Customer part number is required" })}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                    />
                  </div>
                  {errors.custPartNo && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.custPartNo.message}</p>
                  )}
                </div>

                {/* Order Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Order Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      {...register("orderNumber", { required: "Order number is required" })}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                    />
                  </div>
                  {errors.orderNumber && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.orderNumber.message}</p>
                  )}
                </div>

              </div>

              {/* Modal Footer / Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUpdate}
                  className="bg-gradient-to-r from-brand-emerald to-brand-blue hover:from-brand-emerald/90 hover:to-brand-blue/90 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-75 flex items-center gap-2 focus:outline-none"
                >
                  {isSubmittingUpdate && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
