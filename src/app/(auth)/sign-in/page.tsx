"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchemas";
import { signUpSchema } from "@/schemas/signUpSchemas";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
function SignIn() {
  const [username, setUsername] = useState("");
  const [userNameMessage, setuserNameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceValue(username, 300);
  const router = useRouter();

  //zod

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setuserNameMessage("");
        try {
          const res = await axios.get(
            `/api/check-username-unique?username=${debouncedUsername}`
          );

          setuserNameMessage(res?.data?.message);
        } catch (error) {
          const axioserror = error as AxiosError<ApiResponse>;
          setuserNameMessage(
            axioserror.response?.data?.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [debouncedUsername]);

  return <div></div>;
}

export default SignIn;
