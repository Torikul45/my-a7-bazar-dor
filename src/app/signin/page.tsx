"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SigninPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [googleLoading, setGoogleLoading] = useState(false);
const [githubLoading, setGithubLoading] = useState(false);

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
e.preventDefault();
setLoading(true);


try {
  const result = await signIn.email({
    email: email.trim(),
    password,
  });

  if (result.error) {
    toast.error(
      result.error.message || "ইমেইল অথবা পাসওয়ার্ড ভুল!"
    );
    return;
  }

  toast.success("সাইন ইন সফল হয়েছে!", {
    id: "email-login-success",
  });

  setTimeout(() => {
    router.replace("/");
    router.refresh();
  }, 800);
} catch (error) {
  console.error("Email sign in failed:", error);
  toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন!");
} finally {
  setLoading(false);
}


}

async function handleGoogleSignIn() {
setGoogleLoading(true);


try {
  const result = await signIn.social({
    provider: "google",
    callbackURL: "/auth-success",
  });

  if (result.error) {
    toast.error(
      result.error.message || "Google দিয়ে সাইন ইন করা যায়নি।"
    );
    setGoogleLoading(false);
  }
} catch (error) {
  console.error("Google sign in failed:", error);
  toast.error("Google দিয়ে সাইন ইন করা যায়নি। আবার চেষ্টা করুন!");
  setGoogleLoading(false);
}


}

async function handleGitHubSignIn() {
setGithubLoading(true);


try {
  const result = await signIn.social({
    provider: "github",
    callbackURL: "/auth-success",
  });

  if (result.error) {
    toast.error(
      result.error.message || "GitHub দিয়ে সাইন ইন করা যায়নি।"
    );
    setGithubLoading(false);
  }
} catch (error) {
  console.error("GitHub sign in failed:", error);
  toast.error("GitHub দিয়ে সাইন ইন করা যায়নি। আবার চেষ্টা করুন!");
  setGithubLoading(false);
}


}

const isLoading = loading || googleLoading || githubLoading;

return ( <main className="min-h-screen bg-[#f0f5f1] px-4 pt-44 pb-8"> <div className="mx-auto max-w-md"> <div className="mb-5 text-center"> <h1 className="text-2xl font-bold text-gray-900">
আবার স্বাগতম </h1>


      <p className="mt-2 text-sm text-gray-500">
        আপনার অ্যাকাউন্টে সাইন ইন করুন।
      </p>
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            ইমেইল
          </label>

          <input
            type="email"
            placeholder="আপনার ইমেইল লিখুন"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#05893E]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            পাসওয়ার্ড
          </label>

          <input
            type="password"
            placeholder="আপনার পাসওয়ার্ড লিখুন"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#05893E]"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#05893E] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#047532] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-500">অথবা</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-200 px-2 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FcGoogle size={20} className="shrink-0" />
          <span className="truncate">
            {googleLoading
              ? "সংযোগ হচ্ছে..."
              : "Google দিয়ে চালিয়ে যান"}
          </span>
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleGitHubSignIn}
          className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-200 px-2 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaGithub size={20} className="shrink-0" />
          <span className="truncate">
            {githubLoading
              ? "সংযোগ হচ্ছে..."
              : "GitHub দিয়ে চালিয়ে যান"}
          </span>
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-gray-600">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#05893E] hover:underline"
        >
          সাইন আপ করুন
        </Link>
      </p>
    </div>

    <p className="mt-5 text-center text-xs text-gray-400">
      <Link href="/" className="hover:text-[#05893E]">
        হোম পেজে ফিরে যান
      </Link>
    </p>
  </div>
</main>


);
}
