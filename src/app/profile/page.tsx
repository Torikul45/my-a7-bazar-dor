"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [name, setName] = useState(() => user?.name ?? "");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "error"
  );
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  function showMessage(
    text: string,
    type: "success" | "error" = "error"
  ) {
    setMessage(text);
    setMessageType(type);
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      showMessage("আপনার নাম লিখুন।");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
      });

      if (error) {
        showMessage(error.message || "নাম আপডেট করা যায়নি।");
        return;
      }

      setName(trimmedName);
      showMessage("আপনার নাম সফলভাবে আপডেট হয়েছে!", "success");
    } catch {
      showMessage("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    setMessage("");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        showMessage(error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      showMessage("সাইন আউট করার সময় সমস্যা হয়েছে।");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f0f5f1]">
        <p className="text-gray-600">প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f0f5f1] px-4">
        <UserRound size={48} className="text-[#05893E]" />

        <h1 className="text-2xl font-bold text-[#26332b]">
          আপনি সাইন ইন করেননি
        </h1>

        <p className="text-center text-gray-500">
          প্রোফাইল দেখতে প্রথমে আপনার অ্যাকাউন্টে সাইন ইন করুন।
        </p>

        <Link
          href="/signin"
          className="rounded-lg bg-[#05893E] px-6 py-3 font-semibold text-white hover:bg-[#047532]"
        >
          সাইন ইন
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f5f1] px-4 pb-10 pt-36">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-[#26332b]">
          আমার প্রোফাইল
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও আপডেট করুন।
        </p>

        {/* Profile Card */}
        <section className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#dfe7e0] bg-white/70 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#dfe7e0] bg-[#e4f4e8] text-[#078b43]">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name || "User"}'s profile`}
                  width={80}
                  height={80}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={38} />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="wrap-break-word text-lg font-semibold text-[#26332b]">
                {user.name || "নাম দেওয়া হয়নি"}
              </h2>

              <p className="break-all text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          {/* Sign Out */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center justify-center gap-2 self-start rounded-lg border border-red-400 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <LogOut size={16} />
            {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
          </button>
        </section>

        {/* Update Profile Form */}
        <section className="mt-5 rounded-2xl border border-[#dfe7e0] bg-white/70 p-5 sm:p-6">
          <h2 className="font-bold text-[#26332b]">তথ্য আপডেট</h2>

          <form onSubmit={handleUpdate} className="mt-6 space-y-4 sm:px-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                নাম
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="আপনার নাম লিখুন"
                autoComplete="name"
                required
                maxLength={100}
                className="w-full rounded-lg border border-[#dfe7e0] bg-white px-3 py-2.5 outline-none focus:border-[#05893E]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#05893E] py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#047532] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`text-sm ${
                  messageType === "success"
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}

