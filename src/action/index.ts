"use server";

import { cookies } from "next/headers";

/**
 * Helper to construct request headers including the authorization Bearer token.
 */
const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const addProducts = async (data: any) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-items`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      return {
        success: false,
        message: `Server returned non-JSON response. Status: ${res.status}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to connect to the server.",
    };
  }
};

export const createUser = async (formData: any) => {
  try {
    // Map frontend field names to backend schema database fields
    const backendData = {
      name: formData.employeeName,
      employeeId: formData.employeeId,
      email: formData.employeeEmail,
      mobileNumber: formData.mobileNumber,
      password: formData.password,
    };

    const headers = await getAuthHeaders();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(backendData),
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      return {
        success: false,
        message: `Server returned HTML/error response (Status: ${res.status}). Please verify that your backend project is running/deployed with updated routes.`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to communicate with the server. Please check your connection.",
    };
  }
};

export const getUsers = async () => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
      method: "GET",
      headers,
      cache: "no-store", // Ensure we bypass Next cache to get fresh users
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      return {
        success: false,
        message: `Server returned non-JSON response. Status: ${res.status}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch users.",
    };
  }
};

export const updateUser = async (id: string, formData: any) => {
  try {
    // Map frontend fields to backend schema
    const backendData: any = {};
    if (formData.employeeName !== undefined) backendData.name = formData.employeeName;
    if (formData.employeeId !== undefined) backendData.employeeId = formData.employeeId;
    if (formData.employeeEmail !== undefined) backendData.email = formData.employeeEmail;
    if (formData.mobileNumber !== undefined) backendData.mobileNumber = formData.mobileNumber;
    if (formData.password) backendData.password = formData.password;

    const headers = await getAuthHeaders();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(backendData),
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      return {
        success: false,
        message: `Server error status: ${res.status}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update user.",
    };
  }
};

export const deleteUser = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`, {
      method: "DELETE",
      headers,
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      return {
        success: false,
        message: `Server error status: ${res.status}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete user.",
    };
  }
};

export const loginUser = async (credentials: any) => {
  try {
    // Standardize input ID
    const formattedId = credentials.employeeId.startsWith("EMP-") 
      ? credentials.employeeId 
      : `EMP-${credentials.employeeId}`;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: formattedId,
        email: credentials.email,
        password: credentials.password
      }),
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      
      // If login is successful, store the token in the cookies so server actions can access it
      if (data.success && data.data?.token) {
        const cookieStore = await cookies();
        cookieStore.set("token", data.data.token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });
      }
      
      return data;
    } else {
      return {
        success: false,
        message: "Invalid response from server during login."
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to connect to the server for authentication."
    };
  }
};

export const logoutUser = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getItems = async () => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-items`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      return {
        success: false,
        message: `Server returned non-JSON response. Status: ${res.status}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch items.",
    };
  }
};

export const updateItem = async (id: string, data: any) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-items/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      return {
        success: false,
        message: `Server returned non-JSON response. Status: ${res.status}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update item.",
    };
  }
};

export const deleteItem = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-items/${id}`, {
      method: "DELETE",
      headers,
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      return {
        success: false,
        message: `Server returned non-JSON response. Status: ${res.status}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete item.",
    };
  }
};
