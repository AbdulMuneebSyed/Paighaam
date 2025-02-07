"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
];

export default function Profile() {
  const [name, setName] = useState("John Doe");
  const [language, setLanguage] = useState("English");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate profile update
    console.log("Updating Paighaam profile", { name, language, photo });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md"
    >
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Your Paighaam Profile
      </h1>
      <div className="mb-6 flex justify-center">
        <Avatar className="h-32 w-32">
          <AvatarImage
            src="/placeholder.svg?height=128&width=128"
            alt="Profile"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
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
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
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
            Update Profile Photo
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
          Update Paighaam Profile
        </Button>
      </form>
    </motion.div>
  );
}
