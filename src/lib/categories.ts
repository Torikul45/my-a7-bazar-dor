export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export async function getCategories(): Promise<Category[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return [];
    }

    const res = await fetch(`${apiUrl}/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.categories)) {
      return data.categories;
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch {
    return [];
  }
}