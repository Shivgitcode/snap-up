"use client"

import About from "@/components/About";
import Hero from "@/components/Hero";
import StatusPage from "@/components/StatusPage";


export default function Home() {
  return (
    <div className="text-black">
      <Hero></Hero>
      <About></About>
      <StatusPage></StatusPage>

    </div>
  )

}
