"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()
  if (session.status === "unauthenticated") {
    return router.push("/")
  }
  return (
    <div className="min-w-full min-h-screen flex  ">
      <Sidebar></Sidebar>
      {children}
    </div>
  )
}
