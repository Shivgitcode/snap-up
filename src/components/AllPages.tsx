"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { Delete, EllipsisVertical, Pause, Trash2 } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/trpc/client";
import { Monitor } from "@/utils";

export default function AllPages({ el }: { el: Monitor }) {
    const [isUp, setIsUp] = useState("up");


    return (
        <>
            <div className="w-full mt-10 mx-auto flex justify-between">
                <div className="w-full flex items-center gap-5">
                    <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isUp === "up" ? "bg-green-600" : "bg-red-600"} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isUp === "up" ? "bg-green-600" : "bg-red-600"}`}></span>
                    </span>
                    <div>
                        <span className="text-white">{el.name}</span>
                        <p className="text-white">{isUp}</p>

                    </div>
                </div>

                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-white"><EllipsisVertical></EllipsisVertical></DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#334155] text-white p-4 rounded-lg mt-5 mr-10">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center hover:outline-none">
                                <span ><Pause></Pause></span>
                                <Button size={"default"} className="bg-transparent hover:bg-transparent shadow-none">pause</Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center mt-5 hover:outline-none ">
                                <span><Trash2 color="red"></Trash2></span>
                                <Button className=" bg-transparent hover:bg-transparent border-none shadow-none">remove</Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem></DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>


        </>
    )
}

