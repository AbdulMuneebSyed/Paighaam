"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation"; // Importing useRouter
import { supabase } from "@/lib/supabase"; // Import Supabase client

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
  const router = useRouter(); // Using useRouter

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Fetch the phone number from localStorage
  const phoneNumber = localStorage.getItem("phone_number");
  if (!phoneNumber) {
    alert("Phone number is missing in localStorage!");
    return;
  }

  // Upload the photo to Supabase Storage
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

  // Insert the user details into the users table (or update if necessary)
  const { data: userData, error } = await supabase
    .from("users")
    .update({
      name,
      preferred_language: language,
      profile_pic: photoUrl,
    })
    .eq("phone_number", phoneNumber)
    .select("id"); // Fetch the user's id after update

  if (error) {
    alert("Error setting up profile: " + error.message);
    console.log(error);
    return;
  }

  // Store the user's id in localStorage
  const userId = userData?.[0]?.id;
  if (userId) {
    localStorage.setItem("user_id", userId);
  }
  console.log(userId)
  // Use router.push to navigate to the dashboard
  router.push("/dashboard/chats"); // Redirects to the dashboard page
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
          Set Up Your Paighaam Profile
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Your Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="language"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Preferred Language
            </Label>
            <Select onValueChange={setLanguage} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className="h-48 overflow-y-scroll">
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label
              htmlFor="photo"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Profile Photo
            </Label>
            <Input
              type="file"
              id="photo"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="w-full"
              
            />
          </div>
          <Button type="submit" className="w-full">
            Complete Profile
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
