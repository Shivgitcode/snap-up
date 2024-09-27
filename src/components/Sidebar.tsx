import { Contact, Globe, LogOut, Monitor } from "lucide-react"
import Link from "next/link"

export default function Sidebar() {
    const side=[
        {id:1,name:"Monitors",icon:Monitor},
        {id:2,name:"Contacts",icon:Contact},
        {id:3,name:"Status Page",icon:Globe},
    ]
  return (
    <div className=" bg-[#334155] py-[32px] px-[16px] min-w-[300px]">
        <nav className="flex flex-col justify-between min-h-full">
            <div>
                <h1 className="text-white font-bold text-[30px] mb-[26px]">Snap Up</h1>
                <ul>
                    {side.map(el=>{
                        return <li className="flex items-center gap-5 mb-10 text-white"><el.icon/><span>{el.name}</span></li>
                    })}
                </ul>

            </div>
            <div className="flex items-center text-white gap-5">
                <LogOut></LogOut>
                <button>logout</button>
            </div>
        </nav>
    </div>
  )
}
