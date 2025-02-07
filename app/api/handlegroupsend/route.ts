import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { group_id, sender_id, message, language } = await request.json();

    // Get all group members
    const { data: members } = await supabase
      .from("group_member")
      .select("user_id")
      .eq("group_id", group_id);

    if (!members?.length) {
      return NextResponse.json({ error: "No members found" }, { status: 400 });
    }

    // Get target languages for all members
    const { data: users } = await supabase
      .from("users")
      .select("id, preferred_language")
      .in(
        "id",
        members.map((m) => m.user_id)
      );

    // Translate for each member's preferred language
    const client = new GoogleGenerativeAI(
      "AIzaSyDZWZijo60xAMZOiU4Zs-2M0uWGaX9Sdcs"
    );
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

    let translated_message = message;
    let roman_translated_message = message;

    if (users && users.length > 0) {
      // For simplicity, translate to the first member's language
      // You might want to implement a different strategy here
      const targetLanguage = users[0].preferred_language;

      const translatePrompt = `Translate from ${language} to ${targetLanguage}: ${message}`;
      const translation = await model.generateContent(translatePrompt);
      translated_message = translation.response.text();

      const romanPrompt = `Romanize this text: ${translated_message}`;
      const romanization = await model.generateContent(romanPrompt);
      roman_translated_message = romanization.response.text();
    }

    // Insert into group chats
    const { error } = await supabase.from("group_chats").insert({
      group_id,
      sender_id,
      message,
      translated_message,
      roman_translated_message,
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
