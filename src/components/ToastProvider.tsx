"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          zIndex: 99999,
        },
        success: {
          duration: 3000,
          style: {
            background: "#05893E",
            color: "#ffffff",
          },
        },
        error: {
          duration: 4000,
          style: {
            background: "#dc2626",
            color: "#ffffff",
          },
        },
      }}
    />
  );
}
