"use client";

import { MessageCard } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/AcceptMessageSchemas";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Copy, Loader2, RefreshCw } from "lucide-react";
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
      toast.success("Link copied");
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
        toast.success("Messages refreshed");
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
    setMessages((prev) =>
      prev.filter((m) => String(m._id) !== messageId)
    );
  };

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Please sign in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Your messages
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Anything sent to your link shows up here.
            </p>
          </div>

          <Button
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            variant="outline"
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
        <Card className="mb-6">
          <CardContent>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Your link
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="flex-1 bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600/40 transition-shadow"
              />
              <Button onClick={copyToClipboard} className="whitespace-nowrap">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Accept Toggle */}
        <Card className="mb-10">
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="text-sm font-medium text-foreground">
                Accepting messages
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Turn this off to stop receiving new messages
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isSwitchLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Separator className="my-10" />

        {/* Messages */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Inbox
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-border">
              <p className="text-foreground">No messages yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Share your link to start receiving anonymous messages.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {messages.map((message) => (
                <MessageCard
                  key={String(message._id)}
                  message={message}
                  username={username}
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
