"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingAuthPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/profile-setup");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h1 className="text-2xl font-bold mb-2">Authenticating...</h1>
        <p className="text-gray-600 text-center">
          Please wait while we verify your account.
        </p>
      </div>
    </div>
  );
}
