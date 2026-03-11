"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchemas";
import { toast } from "sonner";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      Identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.Identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Incorrect username or password");
      } else {
        toast.error(result.error);
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden">
      {/* Optional subtle background effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.12),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.10),transparent_40%)]"></div>
      </div>

      <div className="relative w-full max-w-md p-8 md:p-10 space-y-8 bg-gray-900/70 backdrop-blur-xl border border-gray-800/60 rounded-2xl shadow-2xl shadow-black/60">
        {/* Icon + Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-2">
            <LockKeyhole className="w-8 h-8 text-blue-400" strokeWidth={1.8} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Text Vault
          </h1>
          <p className="text-gray-400 text-lg font-light tracking-wide">
            Your messages. Truly private.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="Identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Username or Email
                  </FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      className="bg-gray-950/60 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500/70 transition-all pr-10"
                      autoCapitalize="none"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Passphrase</FormLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="bg-gray-950/60 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500/70 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-6 rounded-xl transition-all shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Unlocking..." : "Unlock Vault"}
            </Button>
          </form>
        </Form>

        <div className="text-center pt-4">
          <p className="text-gray-400">
            First time here?{" "}
            <Link
              href="/sign-up"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Create a new vault
            </Link>
          </p>
        </div>

        {/* Optional trust / vibe line */}
        <p className="text-xs text-center text-gray-600 mt-8">
          End-to-end encrypted • No logs • Anonymous by design
        </p>
      </div>
    </div>
  );
}
