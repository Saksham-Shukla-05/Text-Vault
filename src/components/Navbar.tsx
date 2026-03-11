"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  const { theme, setTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
            <Shield className="h-5 w-5 text-teal-400" />
          </div>

          <span className="text-lg sm:text-xl font-semibold tracking-tight text-white">
            Text Vault
          </span>
        </Link>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg hover:bg-slate-800 text-slate-300"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-300" />
            )}
          </Button> */}

          {session ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
              {/* User Info */}
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">
                  {user?.username || user?.email?.split("@")[0]}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-500"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Link href="/sign-in">Login</Link>
              </Button>

              <Button
                asChild
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg text-slate-300"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-300" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg text-slate-300"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={cn(
          "absolute inset-x-0 top-full bg-slate-950 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 md:hidden",
          mobileOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible pointer-events-none",
        )}
      >
        <div className="flex flex-col space-y-4 p-6">
          {session ? (
            <>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-semibold">
                  {(
                    user?.username?.[0] ||
                    user?.email?.[0] ||
                    "U"
                  ).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {user?.username || user?.email}
                  </p>
                  <p className="text-xs text-slate-400">Active session</p>
                </div>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:text-white hover:border-slate-500"
              >
                <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              </Button>

              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                  Create Account
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
