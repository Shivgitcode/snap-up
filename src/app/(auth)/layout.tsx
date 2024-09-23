import Navbar from "@/components/Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className=" bg-mainbg w-full min-h-screen"><Navbar></Navbar>{children}</div>
    )
}
