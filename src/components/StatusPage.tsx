import Image from "next/image";

export default function StatusPage() {
    return (
        <div className="w-full pt-[80px] bg-[#f1f5f9] relative overflow-hidden">
            <div className="w-[60%] mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <h2 className="text-[36px] font-bold text-mainbg">Status Page</h2>
                    <p className=" text-[#6b7280] text-[20px] pt-[20px]">Let your customers see your website's status or keep it displayed for your team in the office</p>

                </div>

                <div className="relative w-[700px] h-[500px] overflow-hidden ">
                    <Image src={"/status.png"} alt="dafl" fill objectFit="cover" ></Image>

                </div>


            </div>

        </div>
    )
}
