import Link from "next/link";

export default function NotFound() {
return ( <main className="flex min-h-[85vh] items-center justify-center bg-[#F1F5F1] px-4 py-12 sm:px-6 lg:px-8"> <div className="flex min-h-125 w-full max-w-7xl flex-col items-center justify-center rounded-3xl border border-[#E0E8E0] bg-white px-5 py-12 text-center shadow-md sm:px-12 sm:py-16 lg:min-h-137.5 lg:px-20"> <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 sm:h-28 sm:w-28"> <span className="text-5xl sm:text-6xl">🔍</span> </div>

    <p className="mb-4 text-8xl font-extrabold text-[#05893E] sm:text-9xl">
      404
    </p>

    <h1 className="mb-5 text-2xl font-bold text-[#172B1D] sm:text-3xl lg:text-4xl">
      পেজটি খুঁজে পাওয়া যায়নি!
    </h1>

    <p className="mx-auto mb-9 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
      দুঃখিত! তুমি যে পেজটি খুঁজছ, সেটি পাওয়া যাচ্ছে না।
      পেজটির ঠিকানা ভুল হতে পারে অথবা পেজটি সরিয়ে ফেলা হয়েছে।
    </p>

    <Link
      href="/"
      className="inline-flex items-center justify-center rounded-xl bg-[#05893E] px-8 py-4 text-base font-bold text-white shadow-sm transition hover:bg-[#046F32] sm:px-10 sm:text-lg"
    >
      ← হোম পেজে ফিরে যাও
    </Link>

    <p className="mt-8 text-sm text-gray-400">
      বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে
    </p>
  </div>
</main>


);
}
