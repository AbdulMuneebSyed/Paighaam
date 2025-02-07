import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const {
      sender_id,
      receiver_id,
      message,
      sender_language,
      receiver_language,
    } = await request.json();

    const client = new GoogleGenerativeAI(
      "AIzaSyDZWZijo60xAMZOiU4Zs-2M0uWGaX9Sdcs"
    );

    const prompt = `response should be straight forward, act like a translator :Translate the following text from ${sender_language} to ${receiver_language} , dont give me anything extra, you should translate it into native language and as it is and no roman english:\n\n${message}`;
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    const romanPrompt = `response should be straight forward, act like a translator : now give me this text in roman english ${result.response.text()}`;
    const romanResult = receiver_language != "English" ? await model.generateContent(romanPrompt) : result;
    console.log(romanResult.response.text());
    console.log(result.response.text());
    const { error } = await supabase.from("chats").insert({
      sender_id,
      receiver_id,
      message: message,
      translated_message: result.response.text(),
      roman_translated_message: romanResult.response.text(),
      language: sender_language,
    });

    if (error) {
      console.error("DB insertion error:", error);
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
