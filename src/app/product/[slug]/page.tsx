"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProducts, type Product } from "@/lib/products";
import { authClient } from "@/lib/auth-client";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type DetailedProduct = Product & {
  description?: string;
  markets?: Market[];
};

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

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace(
        `/sign-in?callbackURL=${encodeURIComponent(`/product/${slug}`)}`
      );
      return;
    }

    let active = true;

    async function loadProduct() {
      try {
        const products = await getProducts();

        const found = products.find(
          (item) => item.slug === slug || String(item.id) === slug
        );

        if (active) {
          setProduct((found as DetailedProduct | undefined) ?? null);
        }
      } catch (error) {
        console.error("Product load failed:", error);
        if (active) setProduct(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug, session, isPending, router]);

  if (isPending || (!session && !isPending) || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef4ee]">
        <p className="font-semibold text-green-800">লোড হচ্ছে...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#eef4ee] p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#e1eae0] bg-[#f9fcf8] p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold">পণ্য পাওয়া যায়নি</h1>
          <Link
            href="/"
            className="mt-4 inline-block text-green-700 underline"
          >
            হোম পেজে ফিরে যাও
          </Link>
        </div>
      </main>
    );
  }

  const markets = product.markets ?? [];

  const minPrice = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : product.today;

  const maxPrice = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : product.today;

  const averagePrice = markets.length
    ? Math.round(
        markets.reduce(
          (sum, market) => sum + (market.min + market.max) / 2,
          0
        ) / markets.length
      )
    : product.today;

  return (
    <main className="min-h-screen bg-[#eef4ee] px-4 py-8 text-[#202820] sm:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500">
          <Link href="/" className="transition hover:text-green-700">
            হোম
          </Link>
          <span className="mx-2">›</span>
          <Link
            href={`/category/${product.category}`}
            className="transition hover:text-green-700"
          >
            {product.categoryNameBn}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{product.nameBn}</span>
        </div>

        {/* Product Header Card */}
        <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#e1eae0] bg-[#f9fcf8] p-5 shadow-sm sm:flex-row sm:items-center sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#edf5ed] text-3xl">
              {product.categoryIcon || "🛒"}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                প্রতি {getUnit(product.unit)} · {product.categoryNameBn}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {product.description ||
                  `বাংলাদেশের বিভিন্ন বাজারে ${product.nameBn} এর দাম`}
              </p>
            </div>
          </div>

          <div className="min-w-28 rounded-xl border border-[#e1eae0] bg-[#f0f6ef] px-5 py-3 text-center">
            <p className="text-xs text-gray-500">আজকের দাম</p>

            <p className="text-3xl font-bold text-[#202820]">
              {toBanglaNumber(product.today)}
            </p>

            <p className="text-sm text-gray-500">
              টাকা / {getUnit(product.unit)}
            </p>

            {product.change && (
              <p
                className={`mt-1 text-xs font-semibold ${
                  product.change.dir === "down"
                    ? "text-green-600"
                    : product.change.dir === "up"
                      ? "text-red-500"
                      : "text-gray-500"
                }`}
              >
                {product.change.dir === "down"
                  ? "▼"
                  : product.change.dir === "up"
                    ? "▲"
                    : "●"}{" "}
                {toBanglaNumber(product.change.pct)}%
              </p>
            )}
          </div>
        </section>

        {/* Price Summary and Market Table - One Card */}
        <section className="overflow-hidden rounded-2xl border border-[#e1eae0] bg-[#f9fcf8] shadow-sm">
          {/* Price Summary */}
          <div className="p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-bold">দামের সারসংক্ষেপ</h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#e4ece3] bg-[#f0f6ef] p-4">
                <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {toBanglaNumber(minPrice)} টাকা
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  সবচেয়ে কম পাওয়া দাম
                </p>
              </div>

              <div className="rounded-xl border border-[#e4ece3] bg-[#f0f6ef] p-4">
                <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
                <p className="mt-1 text-2xl font-bold text-red-500">
                  {toBanglaNumber(maxPrice)} টাকা
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  বাজারের সর্বোচ্চ দাম
                </p>
              </div>

              <div className="rounded-xl border border-[#e4ece3] bg-[#f0f6ef] p-4">
                <p className="text-sm text-gray-500">গড় দাম</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {toBanglaNumber(averagePrice)} টাকা
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  প্রতি {getUnit(product.unit)}-এর গড় মূল্য
                </p>
              </div>
            </div>
          </div>

          {/* Market Price Table - Reduced Gap */}
          <div className=" border-[#e1eae0]">
            <div className="flex flex-col justify-between gap-2 px-4 py-2 sm:flex-row sm:items-center sm:px-6">
              <h2 className="text-lg font-bold">
                বাজারভিত্তিক আজকের দাম
              </h2>
            </div>

            {/* টেবিলের উপরের ফাঁকা জায়গা কমানো হয়েছে */}
            <div className="px-4 pb-4 pt-1 sm:px-6 sm:pb-6 sm:pt-2">
              {markets.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-[#e3ebe1]">
                  <table className="w-full min-w-162.5 border-collapse text-left text-sm">
                    <thead className="bg-[#f2f7f1] text-gray-600">
                      <tr>
                        <th className="px-4 py-4 font-semibold">বাজার</th>
                        <th className="px-4 py-4 font-semibold">বিভাগ</th>
                        <th className="px-4 py-4 text-right font-semibold">
                          সর্বনিম্ন
                        </th>
                        <th className="px-4 py-4 text-right font-semibold">
                          সর্বোচ্চ
                        </th>
                        <th className="px-4 py-4 text-right font-semibold">
                          গড়
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {markets.map((market, index) => (
                        <tr
                          key={`${market.market}-${index}`}
                          className={`border-t border-[#dfe8dd] transition-colors hover:bg-[#eaf3e8] ${
                            index % 2 === 0
                              ? "bg-[#f9fcf8]"
                              : "bg-[#f0f5ef]"
                          }`}
                        >
                          <td className="whitespace-nowrap px-4 py-4 font-medium">
                            {market.market}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                            {market.division}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-right text-green-700">
                            {toBanglaNumber(market.min)} টাকা
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-right text-red-500">
                            {toBanglaNumber(market.max)} টাকা
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-right font-semibold">
                            {toBanglaNumber(
                              Math.round((market.min + market.max) / 2)
                            )} টাকা
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="rounded-xl bg-[#f8fcf7] p-5 text-sm text-gray-500">
                  এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

