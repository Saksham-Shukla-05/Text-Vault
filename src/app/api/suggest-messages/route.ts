import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// Optional: Edge runtime
export const runtime = "edge";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  const prompt = `Output only a single line string containing exactly three open-ended and engaging questions, separated by '||'. Do not include any explanation, prefixes, or formatting — just the questions. These should be universal, friendly, and suitable for anonymous social messaging (like Qooh.me). Avoid sensitive topics. Example format: What inspires you most in life?||What's a small win you recently celebrated?||If you could relive one day, which would it be and why?`;
  console.log(req);

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
    return NextResponse.json({ success: true, reply });
  } catch (error: unknown) {
    console.error("Error from Groq:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { status?: number; statusText?: string } })
        .response === "object"
    ) {
      const response = (
        error as { response: { status: number; statusText: string } }
      ).response;
      return NextResponse.json(
        {
          success: false,
          message: response.statusText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
