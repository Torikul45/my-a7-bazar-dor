"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { getCategories } from "@/lib/categories";

type Categories = Awaited<ReturnType<typeof getCategories>>;

export default function CategoryMenu({
categories,
}: {
categories: Categories;
}) {
const pathname = usePathname();
const [selectedCategory, setSelectedCategory] = useState<string | null>(
  pathname.startsWith("/category/") ? pathname.split("/")[2] || null : null
);

const activeCategory =
  pathname.startsWith("/category/")
    ? pathname.split("/")[2] || null
    : selectedCategory;

return ( <div className="flex w-full items-center justify-start gap-2 overflow-x-auto px-2 sm:justify-center">
{categories.map((category) => {
const href = `/category/${category.slug}`;


    const isActive =
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      (pathname.startsWith("/product/") &&
        activeCategory === category.slug);

    return (
      <Link
        key={category.id}
        href={href}
        prefetch
        onClick={() => setSelectedCategory(category.slug)}
        aria-current={isActive ? "page" : undefined}
        className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
          isActive
            ? "bg-[#05893E] text-white shadow-sm"
            : "bg-transparent text-gray-700 hover:bg-green-50 hover:text-[#05893E]"
        }`}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {category.icon}
        </span>

        <span>{category.nameBn}</span>
      </Link>
    );
  })}
</div>


);
}
