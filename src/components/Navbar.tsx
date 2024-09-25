"use client"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export default function Navbar() {
    const router = useRouter()
    return (
        <div className="w-full bg-mainbg">
            <nav className="w-[60%] flex justify-between mx-auto items-center pt-5">
                <div className="font-bold text-white cursor-pointer" onClick={() => router.push("/")}>
                    SnapUp
                </div>
                <div className="flex gap-4">
                    <Button variant={"ghost"} size={"sm"} className="text-white" onClick={() => router.push("/login")}>Login</Button>
                    <Button className="text-white bg-[#4b5563] hover:bg-gray-500" onClick={() => router.push("/signup")} size={"sm"}>register</Button>
                </div>
            </nav>
        </div>


    )
}
