import { about } from "@/utils";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function About() {
    return (
        <div className="w-full py-[100px]">
            <div className="w-[70%] mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center gap-8 mb-12">
                    <h2 className=" text-mainbg text-[36px] font-bold leading-[40px]">What Uptime Monitor can do?</h2>
                    <p className=" text-[#6b7280] text-[20px] leading-[28px] w-[60%] text-center">Uptime Monitor is a powerful tool for ensuring the availability of your websites and servers. With our service, you can easily keep track of your online assets and receive alerts when there are any issues or disruptions.</p>
                </div>
                <div className="flex flex-row justify-center flex-wrap w-full gap-8">
                    {about.map(el => (
                        <div className="flex flex-col items-center shadow-md  bg-[#f1f5f9] rounded-md  max-w-[300px] px-[24px] py-[32px] relative">
                            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md p-2 absolute -top-5">
                                <Lock />
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <h3 className="font-bold text-center ">{el.head}</h3>
                                <p className="text-center text-[#6b7280]">{el.desc}</p>
                            </div>
                        </div>
                    ))}


                </div>

            </div>
        </div>
    )
}
