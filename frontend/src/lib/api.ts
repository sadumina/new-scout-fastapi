// frontend/lib/api.ts
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function fetchOpportunities(params: {
  category?: string;
  daterange?: "all" | "today" | "month" | "year";
}) {
  const u = new URL(`${API_BASE}/api/opportunities`);
  if (params.category) u.searchParams.set("category", params.category);
  if (params.daterange) u.searchParams.set("daterange", params.daterange);
  const res = await fetch(u.toString(), { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Failed to fetch opportunities");
  return res.json();
}
