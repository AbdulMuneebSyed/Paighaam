"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate OTP verification
    console.log("Verifying OTP", otp);
    // Redirect to profile setup page
    router.push("/verify-meta");
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-900 to-black"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
      >
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-3xl font-bold text-gray-900"
          >
            Verify Your Paighaam Account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center text-sm text-gray-600"
          >
            Enter the OTP sent to your phone to continue.
          </motion.p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <Label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </Label>
            <Input
              type="text"
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              required
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Button
              type="submit"
              className="w-full rounded-lg bg-gray-900 py-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Verify OTP
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
