"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";

export default function NavbarAuth() {
const { data, isPending } = useSession();
const [isOpen, setIsOpen] = useState(false);
const [isSigningOut, setIsSigningOut] = useState(false);
const router = useRouter();

const user = data?.user;

const handleLogout = async () => {
if (isSigningOut) return;
setIsSigningOut(true);

try {
  const result = await signOut();

  if (result?.error) {
    toast.error("সাইন আউট করা যায়নি! আবার চেষ্টা করুন।");
    return;
  }

  setIsOpen(false);

  toast.success("সাইন আউট সফল হয়েছে!", {
    id: "logout-success",
    duration: 3000,
  });

  setTimeout(() => {
    router.replace("/");
    router.refresh();
  }, 800);
} catch (error) {
  console.error("Logout failed:", error);
  toast.error("সাইন আউট করতে সমস্যা হয়েছে!");
} finally {
  setIsSigningOut(false);
}

};

if (isPending) {
return ( <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
);
}

if (!user) {
return ( <div className="flex items-center gap-2"> <Link
       href="/signin"
       className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
     >
সাইন ইন </Link>

    <Link
      href="/signup"
      className="rounded-lg bg-[#05893E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#047532]"
    >
      সাইন আপ
    </Link>
  </div>
);

}

return ( <div className="relative flex items-center gap-1">
<button
type="button"
onClick={() => setIsOpen((previous) => !previous)}
aria-label="প্রোফাইল মেনু খুলুন"
aria-expanded={isOpen}
className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-100 sm:px-3"
> <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#05893E] text-white">
{user.image ? (
<Image
src={user.image}
alt={user.name || "Profile"}
width={36}
height={36}
unoptimized
className="h-full w-full rounded-full object-cover"
/>
) : ( <svg
           xmlns="http://www.w3.org/2000/svg"
           width="22"
           height="22"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           strokeWidth="1.8"
           strokeLinecap="round"
           strokeLinejoin="round"
         > <circle cx="12" cy="8" r="4" /> <path d="M5 21v-2a7 7 0 0 1 14 0v2" /> </svg>
)} </span>


    <span className="max-w-28 truncate text-sm font-semibold text-gray-800">
      {user.name || "আমার অ্যাকাউন্ট"}
    </span>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-gray-600 transition-transform ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  {isOpen && (
    <>
      <button
        type="button"
        aria-label="মেনু বন্ধ করুন"
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-40 cursor-default"
      />

      <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e4f4e8] text-[#05893E]">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Profile"}
                  width={44}
                  height={44}
                  unoptimized
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                </svg>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">
                {user.name || "নাম দেওয়া হয়নি"}
              </p>
              <p className="break-all text-xs text-gray-500">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/profile"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-[#05893E]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
          </svg>
          <span>আমার প্রোফাইল</span>
        </Link>

        <div className="border-t border-gray-100 pt-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>

            <span>
              {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
            </span>
          </button>
        </div>
      </div>
    </>
  )}
</div>


);
}
