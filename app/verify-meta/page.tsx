"use client";

import { useRouter } from "next/navigation";

export default function MetaMaskVerificationPage() {
  const router = useRouter();

  const handleConnect = () => {
    // Route to the dummy verification URL
    router.push("/verify-meta-mask-ajkl47813290-csadnl78913240");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
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
            onClick={handleConnect}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded flex items-center space-x-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              alt="MetaMask Icon"
              className="w-6 h-6"
            />
            <span>Connect to MetaMask</span>
          </button>
        </div>
      </div>
    </div>
  );
}
