import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Text Vault – Anonymous Messages",
    template: "%s | Text Vault",
  },
  description:
    "Send and receive truly anonymous messages. No signup required to send, end-to-end encrypted, zero logs. Say anything — no traces left behind.",

  // Open Graph (for social sharing previews – Discord, WhatsApp, Facebook, LinkedIn, Telegram, etc.)
  openGraph: {
    title: "Text Vault – Truly Anonymous Messaging",
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

  // Basic SEO signals
  metadataBase: new URL("https://text-vault-5vka.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },

  // Mobile / app hints
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

  // Icons – using your provided image (replace with proper favicon later)
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

  // Optional: if you add a manifest.json to /public later
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Matches your dark theme – adjust hex if needed */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />
      </head>
      <body>{children}</body>
    </html>
  );
}
