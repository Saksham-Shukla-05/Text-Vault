"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { signUpSchema } from "@/schemas/signUpSchemas";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

function SignUp() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const debounce = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    if (!username) return;
    setIsCheckingUsername(true);
    setUsernameMessage("");

    axios
      .get<ApiResponse>(`/api/check-username-unique?username=${username}`)
      .then((res) => setUsernameMessage(res.data.message))
      .catch((err: AxiosError<ApiResponse>) =>
        setUsernameMessage(
          err.response?.data.message ?? "Error checking username",
        ),
      )
      .finally(() => setIsCheckingUsername(false));
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success(res.data.message);
      router.replace(`/verify/${username}`);
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      toast.error(error.response?.data.message ?? "Sign-up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4">
      {/* Subtle glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-10 top-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute right-10 bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-xl shadow-black/50 p-7 space-y-6">
        {/* Header – smaller */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-600/20 border border-purple-500/30">
            <ShieldCheck
              className="w-7 h-7 text-purple-400"
              strokeWidth={1.8}
            />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Text Vault
          </h1>
          <p className="text-gray-400 text-sm">Secure anonymous messaging</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-300 text-sm">
                    Username
                  </FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounce(e.target.value);
                      }}
                      placeholder="yourname"
                      className="h-10 bg-gray-950/60 border-gray-700 text-sm placeholder:text-gray-500 focus:border-purple-500/60 pr-9"
                      autoCapitalize="none"
                    />
                    {isCheckingUsername && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  {usernameMessage && !isCheckingUsername && (
                    <p
                      className={`text-xs ${
                        usernameMessage.toLowerCase().includes("available") ||
                        usernameMessage.includes("unique")
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-300 text-sm">Email</FormLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    className="h-10 bg-gray-950/60 border-gray-700 text-sm placeholder:text-gray-500 focus:border-purple-500/60"
                  />
                  <p className="text-xs text-gray-500">For verification only</p>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-300 text-sm">
                    Passphrase
                  </FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-10 bg-gray-950/60 border-gray-700 text-sm placeholder:text-gray-500 focus:border-purple-500/60 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting || isCheckingUsername}
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-medium rounded-xl shadow-md shadow-purple-900/30 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Vault"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-gray-400 mt-3">
          Already have one?{" "}
          <Link
            href="/sign-in"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Sign in
          </Link>
        </p>

        <p className="text-xs text-center text-gray-600 mt-5">
          End-to-end encrypted • Anonymous
        </p>
      </div>
    </div>
  );
}

export default SignUp;
