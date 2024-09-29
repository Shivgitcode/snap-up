"use client"
import { useState } from "react";
import { Button } from "./ui/button";
import Form from "./Form";


export default function DashboardMain() {
  const about = [
    { id: 1, name: "All" },
    { id: 2, name: "Up" },
    { id: 3, name: "Down" },]
  const [active, setActive] = useState(1);


  return (
    <div className="bg-[#1e293b] min-w-full min-h-screen flex flex-col items-start">
      <div className="w-[70%] mx-auto">
        <div className="flex justify-between items-center  py-10">
          <h2 className=" text-[48px] font-normal text-white">No data</h2>
          <Button className=" bg-[#475569] ">New Monitor</Button>

        </div>
        <div className="border rounded-[10px] text-white w-fit overflow-hidden">
          {about.map(el => (
            <button key={el.id} className={` p-2 px-4 border-r ${el.id == 3 && "border-none"}  ${active === el.id && "bg-slate-500"} hover:bg-slate-400 transition-all duration-100`} onClick={() => setActive(el.id)}>{el.name}</button>
          ))}
        </div>

        <div>
          <Form></Form>
        </div>

      </div>
    </div>
  )
}
