import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const {
      message,
      sender_language,
      receiver_language,
    } = await request.json();
    console.log(sender_language);
    console.log(receiver_language);
    if(sender_language == null || receiver_language == null || message == null){
        return NextResponse.json({
            error: "Missing required fields",
        }, { status: 400});
    }
    const client = new GoogleGenerativeAI(
      "AIzaSyDZWZijo60xAMZOiU4Zs-2M0uWGaX9Sdcs"
    );

    const prompt = `response should be straight forward, act like a translator :Translate the following text from ${sender_language} to ${receiver_language} , dont give me anything extra, you should translate it into native language and as it is and no roman english(try to keep emotions alive):\n\n${message}`;
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const romanPrompt = `response should be straight forward, act like a translator : now give me this text in roman english ${result.response.text()}`;
    const romanResult =
      receiver_language != "English"
        ? await model.generateContent(romanPrompt)
        : result;
    // console.log(romanResult.response.text());
    // console.log(result.response.text());
    
    

    return NextResponse.json({ success: true , translated_message: result.response.text(), roman_translated_message: romanResult.response.text()});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" + error},
      { status: 500 }
    );
  }
}