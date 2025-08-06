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
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function User() {
  const [IsSubmitting, setIsSubmitting] = useState(false);
  // const [isAccepting, setIsAccepting] = useState(false);
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
  console.log(selectedMessage);

  const handleSelect = (str: string) => {
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
    } catch (error) {
      console.log("Error while fetching suggested messages", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    // <div>
    //   <Form {...form}>
    //     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //       <FormField
    //         name="content"
    //         control={form.control}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Write Your Message</FormLabel>
    //             <Input {...field} />
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />

    //       <Button className="w-full" type="submit" disabled={IsSubmitting}>
    //         Send
    //       </Button>
    //     </form>
    //   </Form>
    //   <Button onClick={handleSuggestions} disabled={isSuggesting}>
    //     Suggest Message
    //   </Button>

    //   <div>
    //     {suggestedMessage.length !== 0 &&
    //       suggestedMessage.map((message, idx) => (
    //         <Button
    //           disabled={isSuggesting}
    //           onClick={(e) => handleSelect(e.currentTarget.textContent)}
    //           className="border-2 border-black cursor-pointer"
    //           key={idx}
    //         >
    //           {message}
    //         </Button>
    //       ))}
    //   </div>
    // </div>

    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Send Anonymous Message to @{decodedUsername}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {IsSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={IsSubmitting}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={handleSuggestions}
            className="my-4"
            disabled={isSuggesting}
          >
            Suggest Messages
          </Button>
        </div>
        {suggestedMessage.length === 0 ? (
          <p className="text-muted-foreground">
            No suggestions yet. Click above to generate some!
          </p>
        ) : (
          <>
            <p>Click on any message below to select it.</p>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Messages</h3>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                {suggestedMessage.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2"
                    onClick={() => handleSelect(message)}
                  >
                    {message}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

export default User;
