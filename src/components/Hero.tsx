import Image from "next/image"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
export default function Hero() {
    return (
        <div className="w-full bg-mainbg">
            <section className="w-[60%] mx-auto flex justify-between py-[80px] gap-[32px]">
                <div className=" text-[60px] min-w-[50%] leading-[60px] trackin-[-1.5px] font-bold flex-1 text-white flex flex-col gap-10 self-center justify-center">
                    <h1 className="w-full flex-1">
                        Fast and Reliable
                        <p className=" bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-400 text-transparent">
                            Website Uptime Monitoring

                        </p>
                    </h1>
                    <div className="flex flex-col gap-3 w-full ">
                        <Input placeholder="http://your-website.com" type="text" className="bg-white"></Input>
                        <div className="flex justify-between gap-4">
                            <Input placeholder="your@email.com" type="email" className=" bg-white"></Input>
                            <Button size={"lg"} className=" bg-gradient-to-r from-teal-500 to-cyan-600">Start Monitoring</Button>

                        </div>
                        <p className=" text-[14px] leading-[20px] text-maintext">We need to verify your email address to start monitoring</p>

                    </div>

                </div>
                {/* <div className="  min-w-[800px]  h-[400px] relative flex-1" > */}
                <Image src="/Hero.png" width={700} height={400} alt="dfl" objectFit="cover"></Image>

                {/* </div> */}

            </section>
        </div>
    )
}
