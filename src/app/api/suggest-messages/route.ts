import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// Optional: Edge runtime
export const runtime = "edge";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      stream: true, // You can toggle this to true for streaming
    });

    let reply = "";
    for await (const chunk of response) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) reply += content;
    }
    reply = reply || "No response";
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error from Groq:", error);

    if (error.response) {
      return NextResponse.json(
        {
          success: false,
          message: error.response.statusText,
          status: error.response.status,
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
