"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceValue } from "usehooks-ts";

function SignIn() {
  const [username, setUsername] = useState("");
  const [userNameMessage, setuserNameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceValue(username, 300);

  return <div>page</div>;
}

export default SignIn;
