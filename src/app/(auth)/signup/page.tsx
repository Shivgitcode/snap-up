"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Ghost, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register, User } from "@/actions/auth";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Enter valid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords don't match",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export default function Signup() {
  // ...
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      email: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const response = await register(values);
    router.push("/login");
    toast.success(response);
  };

  return (
    <div className="w-[60%] mx-auto flex flex-col justify-center items-center min-h-[700px] gap-5">
      <div className="text-white flex flex-col items-center">
        <h2 className="text-[30px] leading-[36px] font-bold">
          Create a account
        </h2>
        <Link
          href={"/login"}
          className=" text-[#c7d2fe] hover:text-[#a5b4fc] text-[14px]"
        >
          {" "}
          or Login to your account
        </Link>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-5 min-w-[45%] py-[32px] px-[40px] rounded-md bg-white"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mainbg">Username</FormLabel>
                <FormControl>
                  <Input
                    className="text-mainbg"
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mainbg">Email</FormLabel>
                <FormControl>
                  <Input
                    className="text-mainbg"
                    placeholder="johndoe@gmail.com"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mainbg">Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-mainbg">
                  Password Confirmation
                </FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" flex w-full items-center justify-center gap-8">
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
          <div className="flex justify-center items-center max-h-fit">
            <div className="w-[40%] h-[1px] border"></div>
            <span className="px-5">or</span>
            <div className="w-[40%] h-[1px] border"></div>
          </div>
          <Button
            variant={"ghost"}
            className=" flex justify-center text-center mx-auto"
          >
            <Github></Github>
          </Button>
        </form>
      </Form>
    </div>
  );
}
