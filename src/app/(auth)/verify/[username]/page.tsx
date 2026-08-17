"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchemas";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast.success("Account verified");

      const pendingPassword = sessionStorage.getItem("tv_pending_password");
      sessionStorage.removeItem("tv_pending_password");

      if (pendingPassword) {
        const result = await signIn("credentials", {
          redirect: false,
          identifier: params.username,
          password: pendingPassword,
        });

        if (result?.url && !result.error) {
          router.replace("/dashboard");
          return;
        }
      }

      // No password carried over (e.g. page reloaded) or auto sign-in
      // failed - fall back to asking the user to sign in manually.
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Verification failed");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Verify your email
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit code we sent to your email
        </p>
      </div>

      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification code</FormLabel>
                    <Input
                      placeholder="123456"
                      inputMode="numeric"
                      maxLength={6}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg">
                Verify
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyAccount;
