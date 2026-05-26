"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Edit2, Trash2, ShieldAlert, Key, User, Phone, Mail, Loader2, X, ShieldCheck } from "lucide-react";
import { getUsers, updateUser, deleteUser } from "@/action";

// Define TypeScript interfaces for our component state
interface UserType {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  mobileNumber: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateFormInputs {
  employeeName: string;
  employeeId: string;
  employeeEmail: string;
  mobileNumber: string;
  password?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);

  const isAdmin = currentUser?.role === "ADMIN";

  // Initialize react-hook-form for user updates
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateFormInputs>();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        toast.error(response.message || "Failed to load users");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Set values and open update modal
  const handleOpenUpdateModal = (user: UserType) => {
    if (user.employeeId === "EMP-1" || user.employeeId === "EMP-2") {
      toast.error("Demo system accounts cannot be updated.");
      return;
    }

    setSelectedUser(user);
    // Strip "EMP-" prefix for the digits-only input box display
    const rawIdDigits = user.employeeId.replace("EMP-", "");
    
    setValue("employeeName", user.name);
    setValue("employeeId", rawIdDigits);
    setValue("employeeEmail", user.email);
    setValue("mobileNumber", user.mobileNumber);
    setValue("password", ""); // Keep password blank initially
    setShowPassword(false);
    setIsUpdateModalOpen(true);
  };

  // Submit updated details
  const onUpdateSubmit = async (data: UpdateFormInputs) => {
    if (!selectedUser) return;
    setIsSubmittingUpdate(true);

    // Format employee ID to prepended format
    const formattedId = data.employeeId.startsWith("EMP-") ? data.employeeId : `EMP-${data.employeeId}`;
    const payload = {
      ...data,
      employeeId: formattedId,
    };

    try {
      const response = await updateUser(selectedUser.id, payload);
      if (response.success) {
        toast.success(`User updated successfully!`);
        setIsUpdateModalOpen(false);
        reset();
        fetchUsers(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to update user");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the user");
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (id: string, name: string, employeeId: string) => {
    if (employeeId === "EMP-1" || employeeId === "EMP-2") {
      toast.error("Demo system accounts cannot be deleted.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      return;
    }
    
    try {
      const response = await deleteUser(id);
      if (response.success) {
        toast.success(`User "${name}" deleted successfully!`);
        fetchUsers(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the user");
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Title Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            User Accounts
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage portal credentials, permissions, and roles</p>
        </div>
      </div>

      {/* Loading Skeleton Form */}
      {loading ? (
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow overflow-hidden p-8 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-brand-emerald mb-4" />
          <p className="text-sm text-gray-500 animate-pulse">Loading system user logs, please wait...</p>
        </div>
      ) : (
        /* Responsive User Table Card */
        <div className="bg-white rounded-2xl border border-gray-200 shadow overflow-hidden">
          <div className="min-w-full overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 font-bold">
                <tr>
                  <th className="px-6 py-4">Employee Details</th>
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Contact info</th>
                  <th className="px-6 py-4">System Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400 font-medium">
                      No user accounts found. Go to "Create User" to add new accounts.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-emerald/10 text-brand-emerald font-bold flex items-center justify-center text-sm shadow-inner uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>

                      {/* Employee ID */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className="font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-gray-200">
                          {user.employeeId}
                        </span>
                      </td>

                      {/* Email & Mobile */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {user.mobileNumber}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        {user.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                            <User className="w-3.5 h-3.5" />
                            USER
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2">
                          {user.employeeId !== "EMP-1" && user.employeeId !== "EMP-2" && (
                            <button
                              onClick={() => handleOpenUpdateModal(user)}
                              className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/10"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Update
                            </button>
                          )}
                          {isAdmin && user.employeeId !== "EMP-1" && user.employeeId !== "EMP-2" && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name, user.employeeId)}
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

      {/* UPDATE USER MODAL */}
      {isUpdateModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gray-900 px-6 py-5 text-white flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Edit2 className="w-5 h-5 text-brand-emerald" />
                <span className="font-bold text-lg">Update Account Details</span>
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
              
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Employee Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    {...register("employeeName", { required: "Name is required" })}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                  />
                </div>
                {errors.employeeName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.employeeName.message}</p>
                )}
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Employee ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className="absolute left-9 inset-y-0 flex items-center text-gray-400 font-semibold text-sm select-none">
                    EMP-
                  </span>
                  <input
                    type="text"
                    {...register("employeeId", {
                      required: "Employee ID is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Must contain digits only"
                      }
                    })}
                    className="w-full pl-18 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                  />
                </div>
                {errors.employeeId && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.employeeId.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    {...register("employeeEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email"
                      }
                    })}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                  />
                </div>
                {errors.employeeEmail && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.employeeEmail.message}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    {...register("mobileNumber", {
                      required: "Mobile is required",
                      pattern: {
                        value: /^[0-9+() \-]{8,15}$/,
                        message: "Invalid mobile number"
                      }
                    })}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.mobileNumber.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  New Password (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Leave blank to keep current password"
                    {...register("password", {
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    className="w-full pl-9 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>
                )}
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
