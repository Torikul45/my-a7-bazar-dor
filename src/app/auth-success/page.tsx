"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function AuthSuccessPage() {
const router = useRouter();
const { data: session, isPending } = useSession();

useEffect(() => {
if (isPending) return;


if (session?.user) {
  toast.success("Google দিয়ে সাইন ইন সফল হয়েছে!", {
    id: "google-login-success",
    duration: 3000,
  });

  const timer = setTimeout(() => {
    router.replace("/");
  }, 1200);

  return () => clearTimeout(timer);
}

toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন!", {
  id: "google-login-error",
});

router.replace("/signin");


}, [session, isPending, router]);

return ( <main className="flex min-h-[60vh] items-center justify-center"> <p className="text-lg font-semibold text-[#05893E]">
সাইন ইন হচ্ছে, অপেক্ষা করুন... </p> </main>
);
}
