"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MessageSquare, Users, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: User, label: "Profile", href: "/dashboard/profile" },
    { icon: MessageSquare, label: "Chats", href: "/dashboard/chats" },
    { icon: Users, label: "Groups", href: "/dashboard/groups" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <h2 className="text-xl font-bold">Paighaam</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-hidden">
          <div className="flex h-full flex-col">
            <header className="flex h-16 items-center border-b bg-white px-4">
              <SidebarTrigger />
              <h1 className="ml-4 text-xl font-semibold">
                Paighaam -{" "}
                {menuItems.find((item) => item.href === pathname)?.label}
              </h1>
            </header>
            <div className="flex-1 overflow-auto p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
