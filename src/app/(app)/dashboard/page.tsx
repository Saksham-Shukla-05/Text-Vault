"use client";

import { MessageCard } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/AcceptMessageSchemas";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Copy, Loader2, RefreshCw, Link2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: { acceptMessages: false },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const username = session?.user?.username ?? "";

  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && username) {
      const base = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${base}/u/${username}`);
    }
  }, [username]);

  const copyToClipboard = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Link copied — ready to share");
    }
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", res.data.isAcceptingMessage ?? false);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load your message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(res?.data?.messages || []);
      if (refresh) {
        toast.success("Fresh messages loaded");
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't refresh messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSwitchChange = async (checked: boolean) => {
    const previous = acceptMessages;
    setValue("acceptMessages", checked); // optimistic update

    try {
      const res = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: checked,
      });
      toast.success(res.data.message || "Settings updated");
    } catch (err) {
      console.error(err);
      setValue("acceptMessages", previous); // rollback on error
      toast.error("Couldn't save setting — try again");
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
  };

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Please sign in to open your vault.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-slate-100 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-400">
              Your Vault
            </h1>
            <p className="mt-2 text-slate-400">
              Anonymous messages land here — check back often.
            </p>
          </div>

          <Button
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            className="bg-indigo-600/90 hover:bg-indigo-600 text-white border-none shadow-sm shadow-indigo-900/30"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* Share Link */}
        <div className="mb-10 bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="h-5 w-5 text-teal-400" />
            <h2 className="text-lg font-semibold">Your Private Link</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={profileUrl}
              readOnly
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-none focus:border-teal-600 transition-colors"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-teal-600 hover:bg-teal-700 text-white whitespace-nowrap shadow-sm shadow-teal-900/30"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Toggle */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="text-lg font-medium">Accepting Messages</div>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                acceptMessages
                  ? "bg-teal-500/20 text-teal-300"
                  : "bg-rose-500/20 text-rose-300"
              }`}
            >
              {acceptMessages ? "ON" : "OFF"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-teal-600 data-[state=unchecked]:bg-slate-700"
            />
            {isSwitchLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
            )}
          </div>
        </div>

        <Separator className="my-10 bg-slate-800" />

        {/* Messages */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Messages</h2>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-teal-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-slate-300 text-lg">Nothing here yet...</p>
              <p className="text-slate-500 mt-2">
                Share your link — someone&apos;s secret might arrive soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
