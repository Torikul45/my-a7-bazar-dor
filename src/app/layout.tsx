
import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

import Navbar from "@/components/Navbar";
import ToastProvider from "@/components/ToastProvider";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
});

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "মঙ্গলবার, ৬ অক্টোবর, ২০২৬",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${notoSerifBengali.className} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col overflow-y-auto">
        <ToastProvider />

        <Navbar />
        <div className="flex flex-1 flex-col">
          {children}
        </div>


        
        <Footer />
      </body>
    </html>
  );
}

