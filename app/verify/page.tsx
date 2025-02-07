"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Verify() {
  const [otp, setOtp] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate OTP verification
    console.log("Verifying OTP", otp)
    // Redirect to profile setup page
    window.location.href = "/verify-meta"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-400 to-blue-500"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Verify Your Paighaam Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="otp" className="mb-2 block text-sm font-medium text-gray-700">
              Enter the OTP sent to your phone
            </Label>
            <Input
              type="text"
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Verify OTP
          </Button>
        </form>
      </div>
    </motion.div>
  )
}

