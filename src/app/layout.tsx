import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Text Vault – Anonymous Messages",
    template: "%s | Text Vault",
  },
  description:
    "Send and receive truly anonymous messages. No signup needed to send, end-to-end encrypted, zero logs. Say anything — no traces left behind.",
  keywords: [
    "anonymous messaging",
    "secret messages",
    "anonymous text",
    "private confessions",
    "no trace chat",
    "send anonymous message",
  ],
  authors: [{ name: "Text Vault" }],
  creator: "Text Vault",

  // Open Graph (for Facebook, Discord, LinkedIn, WhatsApp previews, etc.)
  openGraph: {
    title: "Text Vault – Truly Anonymous Messaging",
    description:
      "Whisper secrets, ask honest questions, or share thoughts completely anonymously. No accounts required to send messages.",
    url: "https://text-vault-5vka.vercel.app",
    siteName: "Text Vault",
    images: [
      {
        url: "https://res.cloudinary.com/dlycinwrl/image/upload/v1773265221/Gemini_Generated_Image_sov2itsov2itsov2_qwdxhr.png",
        width: 1200,
        height: 630,
        alt: "Text Vault – Anonymous Messaging App",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Basic SEO
  metadataBase: new URL("https://text-vault-5vka.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },

  // App / mobile hints
  applicationName: "Text Vault",
  appleWebApp: {
    title: "Text Vault",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  // Icons – using your Cloudinary image (no Vercel favicon)
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/dlycinwrl/image/upload/v1773265221/Gemini_Generated_Image_sov2itsov2itsov2_qwdxhr.png",
        type: "image/png",
      },
    ],
    shortcut: [
      "https://res.cloudinary.com/dlycinwrl/image/upload/v1773265221/Gemini_Generated_Image_sov2itsov2itsov2_qwdxhr.png",
    ],
    apple: [
      {
        url: "https://res.cloudinary.com/dlycinwrl/image/upload/v1773265221/Gemini_Generated_Image_sov2itsov2itsov2_qwdxhr.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {" "}
          {/* ← wrap here */}
          <AuthProvider>
            {" "}
            {/* if you still need it */}
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
