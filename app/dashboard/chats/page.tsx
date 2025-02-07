"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [chatMessages, setChatMessages] = useState<Array<any>>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch users (excluding the current user) from the users table.
  useEffect(() => {
    async function fetchUsers() {
      const currentUserId = localStorage.getItem("user_id");
      if (!currentUserId) {
        console.error("No user_id found in localStorage");
        return;
      }

      const { data, error } = await supabase.from("users").select("id, name");

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      const filteredUsers = data?.filter(
        (user) => user.id !== currentUserId
      ) as Array<{ id: string; name: string }>;

      setUsers(filteredUsers);
    }

    fetchUsers();
  }, []);

  // Fetch conversation history when a chat is selected.
  useEffect(() => {
    async function fetchConversation() {
      const currentUserId = localStorage.getItem("user_id");
      if (!currentUserId || !selectedChat) return;

      const orFilter = `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedChat}),and(sender_id.eq.${selectedChat},receiver_id.eq.${currentUserId})`;

      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .or(orFilter)
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error fetching chat messages:", error);
        return;
      }
      setChatMessages(data || []);
    }
    fetchConversation();
  }, [selectedChat]);

  // Subscribe to real-time changes on the chats table.
  useEffect(() => {
    const currentUserId = localStorage.getItem("user_id");
    if (!currentUserId || !selectedChat) return;

    const channel = supabase
      .channel("public:chats")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chats" },
        (payload) => {
          const newMessage = payload.new;
          if (
            (newMessage.sender_id === currentUserId &&
              newMessage.receiver_id === selectedChat) ||
            (newMessage.sender_id === selectedChat &&
              newMessage.receiver_id === currentUserId)
          ) {
            setChatMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedChat]);

  // Scroll to the latest message whenever chatMessages updates.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle sending a message.
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      const currentUserId = localStorage.getItem("user_id");
      if (!currentUserId || !selectedChat) {
        console.error("Missing current user or selected chat");
        return;
      }

      const { data: senderData, error: senderError } = await supabase
        .from("users")
        .select("preferred_language")
        .eq("id", currentUserId)
        .single();

      if (senderError) {
        console.error("Error fetching sender language:", senderError);
        return;
      }
      const senderLanguage = senderData?.preferred_language;

      const { data: receiverData, error: receiverError } = await supabase
        .from("users")
        .select("preferred_language")
        .eq("id", selectedChat)
        .single();

      if (receiverError) {
        console.error("Error fetching receiver language:", receiverError);
        return;
      }
      const receiverLanguage = receiverData?.preferred_language;

      const payload = {
        sender_id: currentUserId,
        receiver_id: selectedChat,
        message: message,
        sender_language: senderLanguage,
        receiver_language: receiverLanguage,
      };

      const res = await fetch("/api/handlesend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Failed to send message");
      }
      setMessage("");
    }, 300);
  };

  return (
    <div className="flex h-full w-full overflow-hidden rounded-lg bg-white shadow-md">
      {/* Sidebar (Chat list) */}
      <div className="w-1/3 border-r">
        <div className="p-4">
          <Input placeholder="Search Paighaam chats..." className="w-full" />
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "cursor-pointer border-b p-4 transition-colors hover:bg-gray-100",
                selectedChat === user.id && "bg-gray-100"
              )}
              onClick={() => setSelectedChat(user.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">Tap to chat</p>
                </div>
              </div>
            </motion.div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat window */}
      <div className="flex w-full flex-col">
        {selectedChat ? (
          <>
            <div className="border-b p-4">
              <h2 className="text-xl font-bold">
                {users.find((user) => user.id === selectedChat)?.name}
              </h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col space-y-4">
                {chatMessages.length === 0 && (
                  <p className="text-center text-sm text-gray-500">
                    Start your Paighaam conversation
                  </p>
                )}
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "p-2 rounded-md min-w-72 max-w-[50%] break-words",
                      msg.sender_id === localStorage.getItem("user_id")
                        ? "bg-black text-white self-end"
                        : "bg-blue-500 text-white self-start"
                    )}
                  >
                    <p className="relative group">
                      {msg.sender_id === localStorage.getItem("user_id")
                        ? msg.message
                        : msg.translated_message}
                      {msg.sender_id != localStorage.getItem("user_id")&&
                        msg.roman_translated_message && (
                          <span className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {msg.roman_translated_message}
                          </span>
                        )}
                    </p>

                    <span className="text-xs text-white block text-right">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your Paighaam..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a Paighaam chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
