"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = "+91" + phoneNumber;
    localStorage.setItem("phone", formattedPhone);

    if (phoneNumber.length !== 10) {
      alert("Please enter a correct phone number.");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("phone_number", formattedPhone)
      .single();
    if (data) {
      localStorage.setItem("phone_number", formattedPhone);
      router.push("/verify");
    }
    if (error && error.code !== "PGRST116") {
      console.error("Error checking user:", error);
      alert("Something went wrong. Please try again.");
      return;
    }
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ phone_number: formattedPhone }]);

    if (insertError) {
      console.error("Error inserting user:", insertError);
      // alert("Could not create an account. Try again.");
      // return;
    }
    localStorage.setItem("phone_number", formattedPhone);
    router.push("/verify");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 to-black"
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-3xl font-bold text-gray-900"
          >
            Paighaam
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center text-sm text-gray-600"
          >
            Connect with friends and family through instant messaging
          </motion.p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <Label
              htmlFor="phoneNumber"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Enter your phone number
            </Label>
            <Input
              type="tel"
              id="phoneNumber"
              placeholder="+91-XXXX-XXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
              Continue
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
