export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

export async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL পাওয়া যায়নি");
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Products API error:", res.status);
      return [];
    }

    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.data)) return data.data;

    console.error("API response-এর format সঠিক নয়");
    return [];
  } catch (error) {
    console.error("Products fetch করতে সমস্যা হয়েছে:", error);
    return [];
  }
}

