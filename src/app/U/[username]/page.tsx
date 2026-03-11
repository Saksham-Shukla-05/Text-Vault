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
import { Loader2, Sparkles } from "lucide-react"; // ← added Sparkles back
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
    } catch (error) {
      console.log(error);
      toast.error("Couldn't get suggestions");
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-slate-100 px-4 py-12">
      {/* Subtle glows matching earlier pages */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(45,212,191,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.10),transparent_50%)]"></div>
      </div>

      <div className="relative w-full max-w-2xl space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
            Send a message to @{decodedUsername}
          </h1>
          <p className="text-slate-400">
            Completely anonymous — say what you really think.
          </p>
        </div>

        <Card className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 shadow-xl">
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Your anonymous message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write whatever is on your mind..."
                          className="min-h-[140px] bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-teal-600 resize-none"
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
                    disabled={isSubmitting || !content.trim()}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-6 rounded-xl shadow-md shadow-teal-900/30 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold">Need inspiration?</h2>
            <Button
              onClick={handleSuggestions}
              disabled={isSuggesting}
              className="bg-indigo-600/90 hover:bg-indigo-700 text-white border-none shadow-sm shadow-indigo-900/30"
            >
              {isSuggesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Suggest Messages
                </>
              )}
            </Button>
          </div>

          {suggestedMessages.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              Click above to get some starting ideas
            </p>
          ) : (
            <Card className="bg-slate-900/60 backdrop-blur-sm border border-slate-800">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-medium text-slate-300">
                  Click any to use it
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedMessages.map((msg, idx) => (
                  <Button
                    key={idx}
                    className="w-full justify-start text-left h-auto py-3 px-4 
                               bg-slate-800 hover:bg-slate-700 
                               text-slate-200 hover:text-white 
                               border border-slate-700 
                               rounded-lg transition-colors"
                    onClick={() => handleSelect(msg)}
                  >
                    {msg}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="bg-slate-800 my-10" />

        <div className="text-center space-y-4">
          <p className="text-slate-400">Want your own anonymous inbox?</p>
          <Link href="/sign-up">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default User;
