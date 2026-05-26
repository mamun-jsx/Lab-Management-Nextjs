"use server";

export const addProducts = async (data: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
