import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchemas";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

const verifyCodeRequestSchema = verifySchema.extend({
  username: z.string().min(1, "Username is required"),
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const parsed = verifyCodeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Invalid input",
        },
        { status: 400 }
      );
    }
    const { username, code } = parsed.data;

    const dcodedUserName = decodeURIComponent(username);

    const ip = getClientIp(request.headers);
    const rl = rateLimit(`verify:${ip}:${dcodedUserName}`, 10, 10 * 60 * 1000);
    if (!rl.success) {
      return Response.json(
        { success: false, message: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }
    const user = await UserModel.findOne({ username: dcodedUserName });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Acc verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired, please sign up again",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying code ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying code",
      },
      { status: 500 }
    );
  }
}
