import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button"

export default function Navbar() {
    return (
        <div className="w-full">
            <nav className="w-[60%] flex justify-between mx-auto items-center pt-5">
                <div className="font-bold text-white ">
                    SnapUp
                </div>
                <div className="flex gap-4">
                    <Button variant={"ghost"} size={"sm"} className="text-white">Login</Button>
                    <Button className="text-white bg-[#4b5563] hover:bg-gray-500" size={"sm"}>register</Button>
                </div>
            </nav>
        </div>


    )
}