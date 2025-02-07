"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type Group = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
};

type GroupMessage = {
  id: string;
  group_id: string;
  sender_id: string;
  message: string;
  translated_message: string;
  roman_translated_message: string;
  language: string;
  timestamp: string;
  sender_name?: string;
};

export default function Groups() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  // Modal state for creating a new group:
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [allUsers, setAllUsers] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useRef<string | null>(null);

  // Fetch user's groups using the group_members table.
  useEffect(() => {
    const fetchGroups = async () => {
      currentUserId.current = localStorage.getItem("user_id");
      if (!currentUserId.current) return;

      const { data, error } = await supabase
        .from("group_members")
        .select("group_id, group:group_id (id, name, created_by, created_at)")
        .eq("user_id", currentUserId.current);

      if (error) {
        console.error("Error fetching groups:", error);
        return;
      }

      const formattedGroups = data?.map((item: any) => item.group) || [];
      setGroups(formattedGroups);
    };

    fetchGroups();
  }, []);

  // Fetch group messages when a group is selected.
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedGroup) return;

      const { data, error } = await supabase
        .from("group_chats")
        .select("*, sender:user_id (name)")
        .eq("group_id", selectedGroup)
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      const formattedMessages = data?.map((msg: any) => ({
        ...msg,
        sender_name: msg.sender?.name,
      })) as GroupMessage[];

      setGroupMessages(formattedMessages);
    };

    fetchMessages();
  }, [selectedGroup]);

  // Real-time updates for group messages.
  useEffect(() => {
    if (!selectedGroup) return;

    const channel = supabase
      .channel("group_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_chats",
          filter: `group_id=eq.${selectedGroup}`,
        },
        (payload) => {
          const newMessage = payload.new as GroupMessage;
          supabase
            .from("users")
            .select("name")
            .eq("id", newMessage.sender_id)
            .single()
            .then(({ data }) => {
              setGroupMessages((prev) => [
                ...prev,
                {
                  ...newMessage,
                  sender_name: data?.name || "Unknown",
                },
              ]);
            });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedGroup]);

  // Scroll to bottom on new messages.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !selectedGroup || !currentUserId.current) return;

    // Get sender's preferred language.
    const { data: senderData } = await supabase
      .from("users")
      .select("preferred_language")
      .eq("id", currentUserId.current)
      .single();

    // Send to API endpoint.
    const res = await fetch("/api/handlegroupsend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group_id: selectedGroup,
        sender_id: currentUserId.current,
        message: message,
        language: senderData?.preferred_language || "en",
      }),
    });

    if (res.ok) setMessage("");
  };

  // When Create Group modal opens, fetch all users except the current user.
  useEffect(() => {
    async function fetchAllUsers() {
      const current = localStorage.getItem("user_id");
      if (!current) return;

      const { data, error } = await supabase.from("users").select("id, name");
      if (error) {
        console.error("Error fetching all users:", error);
        return;
      }
      const filteredUsers = data?.filter(
        (user: any) => user.id !== current
      ) as Array<{ id: string; name: string }>;
      setAllUsers(filteredUsers);
    }
    if (showCreateGroupModal) {
      fetchAllUsers();
    }
  }, [showCreateGroupModal]);

  // Toggle user selection in the modal.
  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Handle creating a new group with the selected members and group name.
  const handleCreateGroup = async () => {
    if (
      !groupName.trim() ||
      selectedUserIds.length === 0 ||
      !currentUserId.current
    ) {
      alert("Please enter a group name and select at least one member.");
      return;
    }

    // Insert new group.
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .insert([{ name: groupName, created_by: currentUserId.current }])
      .select()
      .single();

    if (groupError) {
      console.error("Error creating group:", groupError);
      return;
    }

    const newGroupId = groupData.id;

    // Insert members into group_members table (including current user).
    const members = [currentUserId.current, ...selectedUserIds];
    const { error: memberError } = await supabase.from("group_members").insert(
      members.map((userId) => ({
        group_id: newGroupId,
        user_id: userId,
      }))
    );

    if (memberError) {
      console.error("Error adding group members:", memberError);
      return;
    }

    // Update groups state and select the new group.
    setGroups((prev) => [...prev, groupData]);
    setSelectedGroup(newGroupId);
    // Reset modal state.
    setGroupName("");
    setSelectedUserIds([]);
    setShowCreateGroupModal(false);
  };

  return (
    <div className="flex h-full overflow-hidden rounded-lg bg-white shadow-md">
      {/* Groups List */}
      <div className="w-1/3 border-r">
        <div className="p-4 flex items-center justify-between">
          <Input placeholder="Search Paighaam groups..." className="w-full" />
          <Button size="sm" onClick={() => setShowCreateGroupModal(true)}>
            Create Group
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          {groups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "cursor-pointer border-b p-4 transition-colors hover:bg-gray-100",
                selectedGroup === group.id && "bg-gray-100"
              )}
              onClick={() => setSelectedGroup(group.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{group.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-sm text-gray-500">
                    {/* Created by {group.created_by} */}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </ScrollArea>
      </div>

      {/* Group Chat */}
      <div className="flex w-2/3 flex-col">
        {selectedGroup ? (
          <>
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-bold">
                {groups.find((g) => g.id === selectedGroup)?.name}
              </h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col space-y-4">
                {groupMessages.length === 0 && (
                  <p className="text-center text-sm text-gray-500">
                    Start your Paighaam conversation
                  </p>
                )}
                {groupMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "p-2 rounded-md min-w-72 max-w-[75%] break-words",
                      msg.sender_id === currentUserId.current
                        ? "bg-black text-white self-end"
                        : "bg-blue-500 text-white self-start"
                    )}
                  >
                    <div className="mb-1 text-xs text-gray-300">
                      {msg.sender_name}
                    </div>
                    <p className="relative group">
                      {msg.sender_id === currentUserId.current
                        ? msg.message
                        : msg.translated_message}
                      {msg.sender_id !== currentUserId.current && (
                        <span className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {msg.roman_translated_message}
                        </span>
                      )}
                    </p>
                    <span className="text-xs text-gray-300 block text-right">
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
                  placeholder="Type your Paighaam group message..."
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
            Select a Paighaam group to start messaging
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Create New Group</h3>
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="max-h-60 mb-4">
              {allUsers.length === 0 ? (
                <p className="text-center text-sm text-gray-500">
                  No users available.
                </p>
              ) : (
                allUsers.map((user) => (
                  <div
                    key={user.id}
                    className={cn(
                      "cursor-pointer p-2 border-b hover:bg-gray-100",
                      selectedUserIds.includes(user.id) && "bg-gray-200"
                    )}
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    {user.name}
                  </div>
                ))
              )}
            </ScrollArea>
            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={() => setShowCreateGroupModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateGroup}>
                Create Group
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
