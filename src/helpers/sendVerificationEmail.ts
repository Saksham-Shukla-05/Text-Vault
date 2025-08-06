import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  const mailOptions = {
    from: `"TextVault Support" <${process.env.USER_MAIL}>`,
    to: email,
    subject: "TextVault | Verification Code",
    html: `
      <div style="font-family: sans-serif; line-height: 1.5">
        <h2>Hi ${username},</h2>
        <p>Your verification code for TextVault is:</p>
        <h1 style="letter-spacing: 4px;">${verifyCode}</h1>
        <p>This code will expire in 1 hour.</p>
        <p>If you didn’t request this, you can safely ignore it.</p>
        <br/>
        <p>– The TextVault Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Verification email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
