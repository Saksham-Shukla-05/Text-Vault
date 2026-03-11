// components/ThemeProvider.tsx   (or lib/ThemeProvider.tsx)
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class" // ← critical for Tailwind dark: variants
      defaultTheme="system" // or "dark" if you want to force dark by default
      enableSystem
      enableColorScheme // optional: syncs <meta name="color-scheme">
      disableTransitionOnChange // optional: removes transition flash on toggle
    >
      {children}
    </NextThemesProvider>
  );
}
