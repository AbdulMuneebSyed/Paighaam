"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md"
    >
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Paighaam Settings
      </h1>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="dark-mode"
            className="text-sm font-medium text-gray-700"
          >
            Dark Mode
          </Label>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label
            htmlFor="notifications"
            className="text-sm font-medium text-gray-700"
          >
            Paighaam Notifications
          </Label>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label
            htmlFor="sound-effects"
            className="text-sm font-medium text-gray-700"
          >
            Paighaam Sound Effects
          </Label>
          <Switch
            id="sound-effects"
            checked={soundEffects}
            onCheckedChange={setSoundEffects}
          />
        </div>
      </div>
    </motion.div>
  );
}
