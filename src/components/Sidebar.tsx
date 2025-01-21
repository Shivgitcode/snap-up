import { Contact, Globe, LogOut, Monitor } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchAvatar } from "@/actions/random";

export default function Sidebar() {
  const side = [
    { id: 1, name: "Monitors", icon: Monitor },
    { id: 2, name: "Contacts", icon: Contact },
    { id: 3, name: "Status Page", icon: Globe },
  ];
  const query = useQuery({
    queryKey: ["avatar"],
    queryFn: fetchAvatar,
  });
  const session = useSession();
  return (
    <div className=" bg-[#334155] py-[32px] px-[16px] min-w-[300px]">
      <nav className="flex flex-col justify-between min-h-full">
        <div>
          <h1 className="text-white font-bold text-[30px] mb-1">Snap Up</h1>
          <div className="h-min flex gap-2 items-baseline mb-10 scale-75 -ml-10">
            <Avatar>
              <AvatarImage src={query.data} />
              <AvatarFallback className=" font-bold">
                {session.data?.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-white font-medium">{session.data?.user?.name}</p>
          </div>

          <div>
            <ul>
              {side.map((el) => {
                return (
                  <li key={el.id}>
                    <Button
                      variant={"ghost"}
                      className="flex items-center gap-5 mb-10 text-white hover:bg-transparent hover:text-white"
                    >
                      <el.icon />
                      <span>{el.name}</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div
          className="flex items-center text-white gap-5 cursor-pointer"
          onClick={() => signOut({ redirectTo: "/login" })}
        >
          <LogOut></LogOut>
          <button>logout</button>
        </div>
      </nav>
    </div>
  );
}
