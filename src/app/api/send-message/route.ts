import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

const sendMessageRequestSchema = z.object({
  username: z.string().min(1, "Username is required"),
  content: messageSchema.shape.content,
});

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rl = rateLimit(`send-message:${ip}`, 20, 10 * 60 * 1000);
  if (!rl.success) {
    return Response.json(
      { success: false, message: "Too many messages sent. Please try again later." },
      { status: 429 }
    );
  }

  await dbConnect();

  const body = await request.json();
  const parsed = sendMessageRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid input",
      },
      { status: 400 }
    );
  }
  const { username, content } = parsed.data;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error adding messages", error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
