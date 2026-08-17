"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function User() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

  const params = useParams();
  const rawUsername = params?.username as string;
  const decodedUsername = decodeURIComponent(rawUsername);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const { watch, setValue } = form;
  const content = watch("content");

  const handleSelect = (message: string) => {
    setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/send-message", {
        content: data.content,
        username: decodedUsername,
      });
      toast.success(res.data.message || "Message sent anonymously");
      setValue("content", "");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status === 403) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Failed to send message");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestions = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.post("/api/suggest-messages");
      const questionsArray = res.data.reply
        .split("||")
        .map((q: string) => q.trim());
      setSuggestedMessages(questionsArray.filter(Boolean));
    } catch {
      toast.error("Couldn't get suggestions");
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Send @{decodedUsername} an anonymous message
        </h1>
        <p className="text-muted-foreground">
          They won&apos;t know it&apos;s from you.
        </p>
      </div>

      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write whatever's on your mind..."
                        className="min-h-[140px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !content.trim()}
                  className="px-10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send message"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            Need an idea?
          </h2>
          <Button
            onClick={handleSuggestions}
            disabled={isSuggesting}
            variant="outline"
          >
            {isSuggesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4 text-indigo-600" />
                Suggest messages
              </>
            )}
          </Button>
        </div>

        {suggestedMessages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 text-sm">
            Click above to get a few starting ideas
          </p>
        ) : (
          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-muted-foreground">
                Tap one to use it
              </h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedMessages.map((msg, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4 font-normal"
                  onClick={() => handleSelect(msg)}
                >
                  {msg}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      <div className="text-center space-y-4">
        <p className="text-muted-foreground text-sm">
          Want your own anonymous inbox?
        </p>
        <Link href="/sign-up">
          <Button variant="outline">Create account</Button>
        </Link>
      </div>
    </div>
  );
}

export default User;
