import { LogOut, Monitor } from "lucide-react"
import Link from "next/link"

export default function Sidebar() {
    const side=[
        {id:1,name:"Monitors",icon:Monitor},
        {id:2,name:"Contacts",icon:Monitor},
        {id:3,name:"Status Page",icon:Monitor},
    ]
  return (
    <div className=" bg-[#334155]">
        <nav>
            <div>
                <h1>Snap Up</h1>
                <ul>
                    {side.map(el=>{
                        return <li><el.icon/><span>{el.name}</span></li>
                    })}
                </ul>

            </div>
            <div>
                <LogOut></LogOut>
                <button>logout</button>
            </div>
        </nav>
    </div>
  )
}
