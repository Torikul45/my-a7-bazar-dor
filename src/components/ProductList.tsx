import Link from "next/link";
import { getProducts } from "@/lib/products";

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

export default async function ProductList() {
  const products = await getProducts();

  // Section A: দাম বেড়েছে — সর্বোচ্চ ৬টি
  const increasedProducts = products
    .filter((product) => product.change?.dir === "up")
    .slice(0, 6);

  // Section B: দাম কমেছে — সর্বোচ্চ ৬টি
  const decreasedProducts = products
    .filter((product) => product.change?.dir === "down")
    .slice(0, 6);

  // Product Cards
  const renderProducts = (items: typeof products) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {items.map((product) => {
        const direction = product.change?.dir;
        const percentage = product.change?.pct ?? 0;

        return (
          <Link
            key={product.id}
            href={`/product/${product.slug ?? product.id}`}
            className="group block rounded-2xl border border-[#E3EBE4] bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-[#078B43] hover:shadow-lg"
          >
            {/* Icon + Product Name + Unit */}
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-3xl">
                {product.image && product.image.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.nameBn}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  product.image || product.categoryIcon || "🛒"
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-[#253128] transition group-hover:text-[#078B43]">
                  {product.nameBn}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  প্রতি {getUnit(product.unit)}
                </p>
              </div>
            </div>

            {/* Price + Change Badge */}
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500">আজকের দাম</p>

                <p className="mt-1 text-xl font-extrabold text-[#202A23]">
                  {toBanglaNumber(product.today)} টাকা
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  direction === "up"
                    ? "bg-green-100 text-green-700"
                    : direction === "down"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {direction === "up" ? "▲ " : direction === "down" ? "▼ " : "—"}
                {toBanglaNumber(Math.abs(percentage))}%
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );

  // Empty State
  if (products.length === 0) {
    return (
      <section
        id="সব-পণ্য"
        className="mx-auto max-w-7xl px-4 py-16 text-center"
      >
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12">
          <div className="text-5xl">🛒</div>

          <h2 className="mt-4 text-xl font-bold text-gray-800">
            পণ্যের তথ্য পাওয়া যাচ্ছে না
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-[#078B43] px-5 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F1F5F1]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section A: Price Increased */}
        <div className="mb-14">
          <div className="mb-6">
            <h2 className="mt-2 text-2xl font-extrabold text-[#202A23] sm:text-3xl">
              <span className="text-red-600">▲</span> আজ দাম বেড়েছে
            </h2>
          </div>

          {increasedProducts.length > 0 ? (
            renderProducts(increasedProducts)
          ) : (
            <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
              দাম বেড়েছে এমন পণ্য পাওয়া যায়নি।
            </p>
          )}
        </div>

        {/* Section B: Price Decreased */}
        <div className="mb-14">
          <div className="mb-6">
            <h2 className="mt-2 text-2xl font-extrabold text-[#202A23] sm:text-3xl">
              <span className="text-green-600">▼</span> আজ দাম কমেছে
            </h2>
          </div>

          {decreasedProducts.length > 0 ? (
            renderProducts(decreasedProducts)
          ) : (
            <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
              দাম কমেছে এমন পণ্য পাওয়া যায়নি।
            </p>
          )}
        </div>

        {/* Section C: All Products */}
        <div id="সব-পণ্য" className="scroll-mt-32">
          <div className="mb-6">
            <h2 className="mt-2 text-2xl font-extrabold text-[#202A23] sm:text-3xl">
              সব পণ্য
              
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {" "}
              মোট {toBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে{" "}
            </p>
          </div>

          {renderProducts(products)}
        </div>
      </div>
    </section>
  );
}
