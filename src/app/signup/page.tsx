"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";

export default function SignupPage() {
const router = useRouter();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [loading, setLoading] = useState(false);
const [googleLoading, setGoogleLoading] = useState(false);
const [githubLoading, setGithubLoading] = useState(false);

const isLoading = loading || googleLoading || githubLoading;

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
e.preventDefault();


if (!name.trim()) {
  toast.error("আপনার নাম লিখুন!");
  return;
}

if (!email.trim()) {
  toast.error("আপনার ইমেইল লিখুন!");
  return;
}

if (password.length < 8) {
  toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে!");
  return;
}

if (password !== confirmPassword) {
  toast.error("দুটি পাসওয়ার্ড মিলছে না!");
  return;
}

setLoading(true);

try {
  const result = await signUp.email({
    name: name.trim(),
    email: email.trim(),
    password,
  });

  if (result.error) {
    toast.error(
      result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি!"
    );
    return;
  }

  toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", {
    id: "signup-success",
  });

  setTimeout(() => {
    router.replace("/signin");
  }, 1000);
} catch (error) {
  console.error("Sign up failed:", error);
  toast.error("রেজিস্ট্রেশন ব্যর্থ হয়েছে! আবার চেষ্টা করুন।");
} finally {
  setLoading(false);
}


}

async function handleGoogleSignUp() {
setGoogleLoading(true);


try {
  const result = await signIn.social({
    provider: "google",
    callbackURL: "/auth-success",
  });

  if (result.error) {
    toast.error(
      result.error.message || "Google দিয়ে চালিয়ে যাওয়া যায়নি!"
    );
    setGoogleLoading(false);
  }
} catch (error) {
  console.error("Google sign up failed:", error);
  toast.error("Google authentication-এ সমস্যা হয়েছে!");
  setGoogleLoading(false);
}


}

async function handleGitHubSignUp() {
setGithubLoading(true);


try {
  const result = await signIn.social({
    provider: "github",
    callbackURL: "/auth-success",
  });

  if (result.error) {
    toast.error(
      result.error.message || "GitHub দিয়ে চালিয়ে যাওয়া যায়নি!"
    );
    setGithubLoading(false);
  }
} catch (error) {
  console.error("GitHub sign up failed:", error);
  toast.error("GitHub authentication-এ সমস্যা হয়েছে!");
  setGithubLoading(false);
}


}

return ( <main className="min-h-screen bg-[#f0f5f1] px-4 pt-32 pb-8 sm:pt-40"> <div className="mx-auto max-w-md"> <div className="mb-5 text-center"> <h1 className="text-2xl font-bold text-gray-900">
অ্যাকাউন্ট তৈরি করুন </h1>


      <p className="mt-2 text-sm text-gray-500">
        নিত্যপণ্যের সঠিক দাম জানুন, বাজার করুন সহজে।
      </p>
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-800"
          >
            নাম
          </label>

          <input
            id="name"
            type="text"
            placeholder="আপনার সম্পূর্ণ নাম"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#05893E]"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-800"
          >
            ইমেইল
          </label>

          <input
            id="email"
            type="email"
            placeholder="আপনার ইমেইল লিখুন"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#05893E]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-800"
          >
            পাসওয়ার্ড
          </label>

          <input
            id="password"
            type="password"
            placeholder="কমপক্ষে ৮ অক্ষর"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#05893E]"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-gray-800"
          >
            পাসওয়ার্ড নিশ্চিত করুন
          </label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="আবার পাসওয়ার্ড লিখুন"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#05893E]"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#05893E] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#047532] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
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
          onClick={handleGoogleSignUp}
          disabled={isLoading}
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
          onClick={handleGitHubSignUp}
          disabled={isLoading}
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
        অ্যাকাউন্ট আছে?{" "}
        <Link
          href="/signin"
          className="font-semibold text-[#05893E] hover:underline"
        >
          সাইন ইন
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
