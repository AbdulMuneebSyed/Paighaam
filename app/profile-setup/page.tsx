"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
  "Urdu",
  "Gujarati",
  "Punjabi",
  "Malayalam",
  "Kannada",
  "Odia",
  "Assamese",
  "Maithili",
  "Sanskrit",
];

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPhoneNumber(localStorage.getItem("phone_number"));
      setWallet(localStorage.getItem("wallet"));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      alert("Phone number is missing in localStorage!");
      return;
    }
    let photoUrl = "";
    if (photo) {
      const { data, error: uploadError } = await supabase.storage
        .from("profile-pic")
        .upload(`public/${Date.now()}_${photo.name}`, photo);

      if (uploadError) {
        alert("Error uploading photo: " + uploadError.message);
        return;
      }
      photoUrl = data?.path || "";
    }

    const { data: userData, error } = await supabase
      .from("users")
      .update({
        name,
        preferred_language: language,
        profile_pic: photoUrl,
      })
      .eq("phone_number", phoneNumber)
      .select("id");

    if (error) {
      alert("Error setting up profile: " + error.message);
      return;
    }
    const userId = userData?.[0]?.id;
    if (userId) {
      localStorage.setItem("user_id", userId);
    }
    router.push("/dashboard/chats");
  };

  return (
    <motion.div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white p-6">
      <motion.div className="w-full max-w-md bg-gray-100 p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-black text-center mb-6">
          Profile Setup
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-black">
              Your Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white text-black border-gray-400 focus:border-black"
              required
            />
          </div>
          <div>
            <Label htmlFor="language" className="text-black">
              Preferred Language
            </Label>
            <Select onValueChange={setLanguage} required>
              <SelectTrigger className="w-full bg-white text-black border-gray-400 focus:border-black">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className="bg-white h-36 text-black rounded-lg shadow-lg overflow-y-auto">
                {languages.map((lang) => (
                  <SelectItem
                    key={lang}
                    value={lang}
                    className="hover:bg-gray-300"
                  >
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="photo" className="text-black">
              Profile Photo
            </Label>
            <Input
              type="file"
              id="photo"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="w-full bg-white text-black border-gray-400 focus:border-black"
            />
          </div>
          <Label htmlFor="wallet" className="text-gray-700">
            Your Wallet: {wallet || "Not Available"}
          </Label>
          <Button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-800"
          >
            Complete Profile
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
