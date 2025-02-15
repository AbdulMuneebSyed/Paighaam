import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { group_id, sender_id, message, language } = await request.json();

    if (!group_id ||!sender_id ||!message ||!language) {
      return NextResponse.json({
        error: "Missing required fields",
      }, { status: 400});
    }
    // Insert into group chats
    const { error } = await supabase.from("group_chats").insert({
      group_id,
      sender_id,
      message,
      language,
    });

    if (error) {
      return NextResponse.json(
        { error: "DB insertion failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
