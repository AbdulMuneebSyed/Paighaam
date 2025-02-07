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

    // Check if the number exists in the DB
    const { data, error } = await supabase
      .from("users")
      .select("id") // Selecting just the id to keep it lightweight
      .eq("phone_number", formattedPhone)
      .single();
    if(data){
       localStorage.setItem("phone_number", formattedPhone);
       router.push("/profile-setup");
    }
    if (error && error.code !== "PGRST116") {
      console.error("Error checking user:", error);
      alert("Something went wrong. Please try again.");
      return;
    }

      // If new user, insert into DB and go to profile setup
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ phone_number: formattedPhone }]);

      if (insertError) {
        console.error("Error inserting user:", insertError);
        alert("Could not create an account. Try again.");
        return;
      }
       localStorage.setItem("phone_number", formattedPhone);
      router.push("/profile-setup");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-400 to-blue-500"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Welcome to Paighaam
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Connect with friends and family through instant messaging
        </p>
        <form onSubmit={handleSubmit}>
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
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
