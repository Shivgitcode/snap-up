"use client";
import Sidebar from "@/components/Sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-full min-h-screen flex  ">
      <Sidebar></Sidebar>
      {children}
    </div>
  );
}
