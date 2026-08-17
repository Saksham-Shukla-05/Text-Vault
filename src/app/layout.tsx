import type { Metadata } from "next";
import { Geist } from "next/font/google";

import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Text Vault – Anonymous Messages",
    template: "%s | Text Vault",
  },
  description:
    "Get honest, anonymous messages from friends and followers. Share your link, no account needed to send.",
  keywords: [
    "anonymous messaging",
    "anonymous questions",
    "anonymous feedback",
    "send anonymous message",
  ],
  authors: [{ name: "Text Vault" }],
  creator: "Text Vault",

  // Open Graph (for Facebook, Discord, LinkedIn, WhatsApp previews, etc.)
  openGraph: {
    title: "Text Vault – Anonymous Messages",
    description:
      "Get honest, anonymous messages from friends and followers. Share your link, no account needed to send.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
