"use client"
import { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "./ui/button";
import Form from "./Form";
import { trpc } from "@/trpc/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { auth } from "@/server/auth";
import AllPages from "./AllPages";
import { CronJob } from "cron"
import { Monitor } from "@/utils";


export default function DashboardMain() {
  const about = [
    { id: 1, name: "All" },
    { id: 2, name: "Up" },
    { id: 3, name: "Down" },]
  type newMonitor = {
    message: string,
    data: string
  }
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(true)



  return (
    <div className="bg-[#1e293b] min-w-full min-h-screen flex flex-col items-start">
      <div className="w-[70%] mx-auto">
        <div className="flex justify-between items-center  py-10">
          <h2 className=" text-[48px] font-normal text-white">No data</h2>
          <Form></Form>


        </div>
        <div className="w-full flex justify-between items-center">
          <div className="border rounded-[10px] text-white w-fit overflow-hidden">
            {about.map(el => (
              <button key={el.id} className={` p-2 px-4 border-r ${el.id == 3 && "border-none"}  ${active === el.id && "bg-slate-500"} hover:bg-slate-400 transition-all duration-100`} onClick={() => setActive(el.id)}>{el.name}</button>
            ))}
          </div>

          <div>
            <Button variant={"default"} className=" bg-mainbg">Refresh</Button>
          </div>

        </div>

        <div className="w-full">

        </div>




      </div>
    </div>
  )
}
