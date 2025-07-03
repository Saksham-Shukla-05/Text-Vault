import { signInSchema } from "@/schemas/signInSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      Identifier: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post;
    } catch (error) {}
  };

  return <div>SignIn</div>;
}

export default SignIn;
