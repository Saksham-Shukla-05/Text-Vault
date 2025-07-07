"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ApiResponse } from "@/types/ApiResponse";

function User() {
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedMessage, setSuggestedMessage] = useState([]);
  // Make sure that is the legit way of extracting user and decoding it ?
  const params = useParams();
  const rawUsername = params?.username as string;
  const decodedUsername = decodeURIComponent(rawUsername);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const { watch, setValue } = form;
  const selectedMessage = watch("content");

  const handleSelect = (str) => {
    setValue("content", str);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/send-message", {
        content: data.content,
        username: decodedUsername,
      });

      if (res.data.message) {
        toast.success(res.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status === 403) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Error while sending message!");
      }
      console.log(error);
    } finally {
      setIsSubmitting(false);
      setValue("content", "");
    }
  };
  const handleSuggestions = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.post("/api/suggest-messages");
      // Extract only the questions from the response
      const questionsArray = res.data.reply.split("||");

      setSuggestedMessage(questionsArray);
      console.log(questionsArray);
    } catch (error) {
      console.log("Error while fetching suggested messages");
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Write Your Message</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={IsSubmitting}>
            Send
          </Button>
        </form>
      </Form>
      <Button onClick={handleSuggestions} disabled={isSuggesting}>
        Suggest Message
      </Button>

      <div>
        {suggestedMessage.length !== 0 &&
          suggestedMessage.map((message, idx) => (
            <p
              onClick={(e) => handleSelect(e.currentTarget.textContent)}
              className="border-2 border-black cursor-pointer"
              key={idx}
            >
              {message}
            </p>
          ))}
      </div>
    </div>
  );
}

export default User;
