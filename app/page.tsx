"use client"

import useMetaMask from "@/components/hooks/metamask";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
export default function MetaMaskVerificationPage() {
  const router = useRouter();
  const { account, verified, connectWallet } = useMetaMask();

  useEffect(() => {
    const storeAccount = async () => {
      if (verified && account) {
        // Initialize Supabase client

        localStorage.setItem("account", account);

        // Check if account already exists
        const { data, error } = await supabase
          .from("users")
          .select("id")
          .eq("phone_number", account) // or .eq("account", account) if you have an account column
          .single();

        if (!data && (!error || error.code === "PGRST116")) {
          // Insert new user if not exists
          await supabase.from("users").insert([{ phone_number: account }]); // or { account }
        }

        localStorage.setItem("phone_number", account);
        router.push("/verify-meta-mask-ajkl47813290-csadnl78913240");
      }
    };

    storeAccount();
  }, [verified, account, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-900 to-black">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          {/* MetaMask Logo */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
            alt="MetaMask Logo"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">MetaMask Verification</h1>
          <p className="text-gray-600 mb-6 text-center">
            Please connect your MetaMask wallet to verify your account.
          </p>
          <button
            onClick={connectWallet}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded flex items-center space-x-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              alt="MetaMask Icon"
              className="w-6 h-6"
            />
            <span>Connect to MetaMask</span>
          </button>
          {account && (
            <p className="mt-4 text-gray-700">Connected: {account}</p>
          )}
        </div>
      </div>
    </div>
  );
}
