"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";

type Product = Awaited<ReturnType<typeof getProducts>>[number];
type Category = Awaited<ReturnType<typeof getCategories>>[number];
type SortOption = "default" | "low" | "high";

const toBanglaNumber = (value: number | string) => {
  const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(value).replace(/\d/g, (digit) => digits[Number(digit)]);
};

const getUnit = (unit: string) => {
  if (unit === "kg") return "কেজি";
  if (unit === "litre" || unit === "liter") return "লিটার";
  if (unit === "piece") return "পিস";
  if (unit === "dozen") return "ডজন";
  return unit;
};

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setError(false);

        const [categoryData, productData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        if (!active) return;

        setCategories(categoryData);
        setProducts(productData);
      } catch (err) {
        console.error("Category data load failed:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const category = useMemo(
    () => categories.find((item) => item.slug === slug),
    [categories, slug]
  );

  const categoryProducts = useMemo(() => {
    if (!category) return [];

    return products.filter((product) => {
      const productCategory = String(product.category ?? "")
        .toLowerCase()
        .trim();

      return (
        productCategory === category.slug.toLowerCase().trim() ||
        productCategory === String(category.id).toLowerCase().trim() ||
        productCategory === category.nameBn.toLowerCase().trim() ||
        product.categoryNameBn?.toLowerCase().trim() ===
          category.nameBn.toLowerCase().trim()
      );
    });
  }, [category, products]);

  const filteredProducts = useMemo(() => {
    const result = categoryProducts.filter((product) =>
      product.nameBn.toLowerCase().includes(search.trim().toLowerCase())
    );

    if (sort === "low") {
      return [...result].sort((a, b) => Number(a.today) - Number(b.today));
    }

    if (sort === "high") {
      return [...result].sort((a, b) => Number(b.today) - Number(a.today));
    }

    return result;
  }, [categoryProducts, search, sort]);

  const mainClass =
    "min-h-screen bg-[#F0F6EF] px-4 pb-12 pt-5 sm:px-6 lg:px-8";

  if (loading) {
    return (
      <main className={mainClass}>
        <section className="mx-auto max-w-7xl">
          <div className="mb-6 animate-pulse rounded-2xl border border-[#E1EADF] bg-white p-5">
            <div className="h-5 w-28 rounded bg-gray-100" />
            <div className="mt-4 h-8 w-48 rounded bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border border-[#E1EADF] bg-white p-3"
              >
                <div className="h-10 rounded-lg bg-gray-100" />
                <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
                <div className="mt-3 h-6 w-1/2 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={mainClass}>
        <section className="mx-auto max-w-7xl rounded-2xl border border-red-100 bg-white px-5 py-12 text-center">
          <div className="text-4xl">⚠️</div>
          <h1 className="mt-4 text-xl font-bold text-gray-800">
            পণ্যের তথ্য লোড করা যায়নি
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            ইন্টারনেট সংযোগ পরীক্ষা করে পেজটি আবার চালু করো।
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-[#078B43] px-5 py-3 font-semibold text-white hover:bg-[#066F36]"
          >
            আবার চেষ্টা করো
          </button>
        </section>
      </main>
    );
  }

  if (!category) {
    return (
      <main className={mainClass}>
        <section className="mx-auto max-w-7xl rounded-2xl border border-[#E1EADF] bg-white px-5 py-12 text-center">
          <div className="text-4xl">🛒</div>
          <h1 className="mt-4 text-xl font-bold text-gray-800">
            ক্যাটাগরি পাওয়া যায়নি
          </h1>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-[#078B43] px-5 py-3 font-semibold text-white"
          >
            হোম পেজে ফিরে যাও
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={mainClass}>
      <section className="mx-auto max-w-7xl">
        {/* Category Heading */}
        <div className="mb-5 rounded-2xl border border-[#E1EADF] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] text-3xl sm:h-14 sm:w-14">
              {category.icon || "🛒"}
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-extrabold text-[#171B17] sm:text-2xl">
                {category.nameBn}
              </h1>
              <p className="mt-1 text-sm text-[#525952]">
                {toBanglaNumber(categoryProducts.length)}টি পণ্যের আজকের দাম ও
                পরিবর্তন
              </p>
            </div>
          </div>
        </div>

        {/* Search and Sorting */}
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#E1EADF] bg-white p-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`${category.nameBn} খুঁজুন...`}
              className="w-full rounded-lg border border-gray-200 bg-[#FAFCF9] py-2.5 pl-9 pr-3 text-sm text-gray-800 outline-none focus:border-[#078B43] focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="flex items-center gap-2 sm:shrink-0">
            <button
              type="button"
              onClick={() => setSort("default")}
              className={`h-10 flex-1 rounded-lg border px-3 text-sm font-semibold transition sm:flex-none ${
                sort === "default"
                  ? "border-[#078B43] bg-[#078B43] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#078B43]"
              }`}
            >
              ডিফল্ট
            </button>

            <div className="relative min-w-0 flex-1 sm:w-40 sm:flex-none">
              <select
                value={sort === "default" ? "" : sort}
                onChange={(event) =>
                  setSort((event.target.value || "default") as SortOption)
                }
                aria-label="পণ্যের দাম অনুযায়ী সাজান"
                className={`h-10 w-full appearance-none rounded-lg border py-0 pl-3 pr-8 text-sm outline-none focus:border-[#078B43] ${
                  sort === "default"
                    ? "border-gray-200 bg-white text-gray-700"
                    : "border-[#078B43] bg-green-50 font-semibold text-[#078B43]"
                }`}
              >
                <option value="">দাম সাজান</option>
                <option value="low">কম দাম আগে</option>
                <option value="high">বেশি দাম আগে</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Product Count */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-[#222922] sm:text-lg">
            মোট {toBanglaNumber(filteredProducts.length)}টি পণ্য দেখানো হচ্ছে
          </h2>
        </div>

        {/* Product Cards: 3 cards per row on desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {filteredProducts.map((product) => {
              const direction = product.change?.dir;
              const percentage = Number(product.change?.pct ?? 0);

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug ?? product.id}`}
                  className="group rounded-xl border border-[#E1EADF] bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#078B43] hover:shadow-md sm:p-3.5"
                >
                  {/* Product Information */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F1F5EF] sm:h-14 sm:w-14">
                      {product.image?.startsWith("http") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt={product.nameBn}
                          loading="lazy"
                          className="h-full w-full object-contain p-1.5"
                        />
                      ) : (
                        <span className="text-2xl">
                          {product.image || product.categoryIcon || "🛒"}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold leading-snug text-[#171B17] transition-colors group-hover:text-[#078B43] sm:text-base">
                        {product.nameBn}
                      </h3>
                      <p className="mt-1 text-xs text-[#525952]">
                        প্রতি {getUnit(product.unit)}
                      </p>
                    </div>
                  </div>

                  {/* Price Information */}
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-[#555C55]">আজকের দাম</p>
                      <p className="mt-1 text-lg font-extrabold text-black sm:text-xl">
                        {toBanglaNumber(product.today)}
                        <span className="ml-1 text-xs font-normal sm:text-sm">
                          টাকা
                        </span>
                      </p>
                    </div>

                    <span
                      className={`mb-0.5 flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                        direction === "up"
                          ? "bg-[#FFF1F0] text-[#DC2626]"
                          : direction === "down"
                            ? "bg-[#E8F5E9] text-[#078B43]"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {direction === "up"
                        ? "▲"
                        : direction === "down"
                          ? "▼"
                          : "—"}
                      {toBanglaNumber(Math.abs(percentage))}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E1EADF] bg-white px-5 py-12 text-center">
            <div className="text-4xl">🛒</div>
            <h2 className="mt-4 text-lg font-bold text-gray-800">
              {search
                ? "এই নামে কোনো পণ্য পাওয়া যায়নি"
                : "এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "অন্য নাম দিয়ে খুঁজে দেখো।"
                : "API-তে পণ্যের category তথ্য মিলিয়ে দেখো।"}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 rounded-lg bg-[#078B43] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#066F36]"
              >
                সব পণ্য দেখো
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

