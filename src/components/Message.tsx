"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { Loader2, Share2, X } from "lucide-react";
import { Message } from "@/model/User";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { generateShareImage } from "@/lib/generateShareImage";

type MessageCardProps = {
  message: Message;
  username: string;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({
  message,
  username,
  onMessageDelete,
}: MessageCardProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast(response.data.message);
      onMessageDelete(String(message._id));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to delete message"
      );
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const blob = await generateShareImage(
        message.content,
        username,
        window.location.origin
      );
      const file = new File([blob], "text-vault-message.png", {
        type: "image/png",
      });

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "Text Vault",
          text: "Someone sent me this anonymously on Text Vault",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "text-vault-message.png";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Image saved — share it to your story");
      }
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") {
        toast.error("Couldn't create the share image");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-sm font-normal leading-relaxed">
            {message.content}
          </CardTitle>
          <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              disabled={isSharing}
              className="text-muted-foreground hover:text-indigo-600"
              aria-label="Share message"
            >
              {isSharing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Delete message"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
    </Card>
  );
}
