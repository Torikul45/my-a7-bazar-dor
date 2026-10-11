import { getProducts } from "@/lib/products";

const toBanglaNumber = (value: number | string) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  return String(value).replace(
    /\d/g,
    (digit) => banglaDigits[Number(digit)]
  );
};

const getUnit = (unit: string) => {
  if (unit === "kg") return "কেজি";
  if (unit === "litre" || unit === "liter") return "লিটার";
  if (unit === "piece") return "পিস";

  return unit;
};

export default async function PriceTicker() {
  const products = await getProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="h-9 overflow-hidden border-b border-gray-200 bg-gray-50">
      <div className="mx-auto h-full max-w-300 px-4">
        <div className="ticker-track flex h-full w-max items-center">
          
          {/* First list */}
          <div className="flex shrink-0 items-center gap-10 pr-10">
            {products.map((product) => {
              const direction = product.change?.dir;
              const percentage = product.change?.pct ?? 0;

              return (
                <div
                  key={product.id}
                  className="flex shrink-0 items-center gap-2"
                >
                  <span className="text-lg leading-none">
                    {product.image || product.categoryIcon}
                  </span>

                  <span className="font-medium text-gray-700">
                    {product.nameBn}
                  </span>

                  <span className="font-semibold text-gray-900">
                    {toBanglaNumber(product.today)} টাকা/
                    {getUnit(product.unit)}
                  </span>

                  {direction === "flat" ? (
                    <span className="font-medium text-gray-500">
                      — ০%
                    </span>
                  ) : (
                    <span
                      className={
                        direction === "up"
                          ? "font-medium text-red-500"
                          : "font-medium text-[#05893E]"
                      }
                    >
                      {direction === "up" ? "▲" : "▼"}{" "}
                      {toBanglaNumber(Math.abs(percentage))}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Second list - repeat */}
          <div className="flex shrink-0 items-center gap-10 pr-10">
            {products.map((product) => {
              const direction = product.change?.dir;
              const percentage = product.change?.pct ?? 0;

              return (
                <div
                  key={`repeat-${product.id}`}
                  className="flex shrink-0 items-center gap-2"
                >
                  <span className="text-lg leading-none">
                    {product.image || product.categoryIcon}
                  </span>

                  <span className="font-medium text-gray-700">
                    {product.nameBn}
                  </span>

                  <span className="font-semibold text-gray-900">
                    {toBanglaNumber(product.today)} টাকা/
                    {getUnit(product.unit)}
                  </span>

                  {direction === "flat" ? (
                    <span className="font-medium text-gray-500">
                      — ০%
                    </span>
                  ) : (
                    <span
                      className={
                        direction === "up"
                          ? "font-medium text-red-500"
                          : "font-medium text-[#05893E]"
                      }
                    >
                      {direction === "up" ? "▲" : "▼"}{" "}
                      {toBanglaNumber(Math.abs(percentage))}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}