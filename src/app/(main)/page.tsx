"use client"

import Hero from "@/components/Hero";
import { trpc } from "@/trpc/client";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="text-black">
      <Hero></Hero>

    </div>
  )

}
