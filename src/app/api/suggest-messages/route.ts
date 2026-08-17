import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const PROMPT = `Output only a single line string containing exactly three open-ended and engaging questions, separated by '||'. Do not include any explanation, prefixes, or formatting — just the questions. These should be universal, friendly, and suitable for anonymous social messaging (like Qooh.me). Avoid sensitive topics. Example format: What inspires you most in life?||What's a small win you recently celebrated?||If you could relive one day, which would it be and why?`;

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const rl = rateLimit(`suggest:${ip}`, 10, 60 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: PROMPT }],
    });

    const reply = response.choices?.[0]?.message?.content || "No response";
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
        { status: response.status },
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
      { status: 500 },
    );
  }
}
