import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
});

function verificationEmailHtml(username: string, verifyCode: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Verify your Text Vault account</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <!-- Preheader (hidden preview text) -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Your Text Vault verification code is inside. It expires in 1 hour.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#ffffff; border:1px solid #e4e4e7; border-radius:12px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:28px; height:28px; background-color:#4f46e5; border-radius:8px; text-align:center; vertical-align:middle;">
                      <span style="color:#ffffff; font-size:15px; line-height:28px; font-weight:600;">T</span>
                    </td>
                    <td style="padding-left:10px; font-size:16px; font-weight:600; color:#18181b;">
                      Text Vault
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px 32px 8px 32px;">
                <p style="margin:0 0 4px 0; font-size:15px; color:#18181b;">Hi ${username},</p>
                <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#52525b;">
                  Use the code below to verify your email address and finish setting up your account.
                </p>
              </td>
            </tr>

            <!-- Code -->
            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; border-radius:10px;">
                  <tr>
                    <td align="center" style="padding:20px;">
                      <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#18181b;">
                        ${verifyCode}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer note -->
            <tr>
              <td style="padding:20px 32px 32px 32px;">
                <p style="margin:0 0 8px 0; font-size:13px; color:#71717a;">
                  This code expires in 1 hour.
                </p>
                <p style="margin:0; font-size:13px; color:#71717a;">
                  Didn&rsquo;t request this? You can safely ignore this email.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 32px; border-top:1px solid #e4e4e7;">
                <p style="margin:0; font-size:12px; color:#a1a1aa;">
                  Text Vault &middot; Anonymous messages, made simple
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function verificationEmailText(username: string, verifyCode: string): string {
  return `Hi ${username},

Use this code to verify your Text Vault account: ${verifyCode}

This code expires in 1 hour. If you didn't request this, you can safely ignore this email.

- Text Vault`;
}

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  const mailOptions = {
    from: `"Text Vault" <${process.env.USER_MAIL}>`,
    to: email,
    subject: `${verifyCode} is your Text Vault verification code`,
    html: verificationEmailHtml(username, verifyCode),
    text: verificationEmailText(username, verifyCode),
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Verification email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
