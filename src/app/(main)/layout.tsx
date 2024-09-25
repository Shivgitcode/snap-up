import Navbar from "@/components/Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar></Navbar>
            {children}
        </div>
    )
}
