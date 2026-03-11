import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

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
    "Send and receive truly anonymous messages. No signup required to send, end-to-end encrypted, zero logs. Say anything without leaving a trace.",

  openGraph: {
    title: "Text Vault – Send Truly Anonymous Messages",
    description:
      "Whisper secrets, ask honest questions, or share thoughts completely anonymously. No accounts needed to send.",
    url: "https://text-vault-5vka.vercel.app",
    siteName: "Text Vault",
    images: [
      {
        url: "https://res.cloudinary.com/dlycinwrl/image/upload/v1773265221/Gemini_Generated_Image_sov2itsov2itsov2_qwdxhr.png",
        width: 1200,
        height: 630,
        alt: "Text Vault – Anonymous Messaging Platform",
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

  // Icons – using your Cloudinary image (you can replace with proper favicon later)
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/dlycinwrl/image/upload/v1773265221/Gemini_Generated_Image_sov2itsov2itsov2_qwdxhr.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://res.cloudinary.com/dlycinwrl/image/upload/v1773265221/Gemini_Generated_Image_sov2itsov2itsov2_qwdxhr.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  // Optional: PWA manifest (add manifest.json to /public later if you want)
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
        {/* Browser UI theme color (dark slate to match your app) */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
