const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;

export const fetchFeaturedUsedCampervans = async () => {
  try {
    const res = await fetch(
      `${API_BASE}/featured-used-caravans`,
      {
        cache: "no-store", // always fresh
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch featured used campervans");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("fetchFeaturedUsedCampervans error:", error);
    return null;
  }
};
