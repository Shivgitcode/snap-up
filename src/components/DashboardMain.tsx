"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "./ui/button";
import Form from "./Form";
import { trpc } from "@/trpc/client";
import { checkWebsitesToMonitor } from "@/actions/monitor";
import { EllipsisVertical } from "lucide-react";
import Loader from "./Loader";
import { keepPreviousData } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";

export default function DashboardMain() {
  const about = [
    { id: 1, name: "All" },
    { id: 2, name: "Up" },
    { id: 3, name: "Down" },
  ];
  const [active, setActive] = useState(1);
  const query = trpc.getAllWebsites.useQuery();
  const handleFetch = async () => {
    await query.refetch();
  };
  const queryMutation = trpc.pauseMonitorStatus.useMutation({
    onSuccess: async (data) => {
      await query.refetch();
      toast.success(data.message);
    },
  });

  console.log(query.data);

  return (
    <div className="bg-[#1e293b] min-w-full min-h-screen flex flex-col items-start">
      <div className="w-[70%] mx-auto">
        <div className="flex justify-between items-center  py-10">
          <h2 className=" text-[48px] font-normal text-white">
            {query.data?.monitors.length !== 0 ? (
              <p>{query.data?.monitors.length} Monitor</p>
            ) : (
              <p>No data</p>
            )}
          </h2>
          <Form></Form>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="border rounded-[10px] text-white w-fit overflow-hidden">
            {about.map((el) => (
              <button
                key={el.id}
                className={` p-2 px-4 border-r ${
                  el.id == 3 && "border-none"
                }  ${
                  active === el.id && "bg-slate-500"
                } hover:bg-slate-400 transition-all duration-100`}
                onClick={() => setActive(el.id)}
              >
                {el.name}
              </button>
            ))}
          </div>

          <div>
            <Button
              variant={"default"}
              className=" bg-mainbg"
              onClick={handleFetch}
              disabled={query.isFetching ? true : false}
            >
              {query.isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 mt-10">
          {query.isFetching ? (
            <div className="flex justify-center  items-center mt-10 w-full">
              <Loader></Loader>
            </div>
          ) : query.data?.monitors.length != 0 ? (
            query.data?.monitors.map((el) => (
              <div key={el.id} className=" w-full flex justify-between">
                <div className=" text-white font-medium">
                  <p>{el.name}</p>
                  <p>{el.statuscode}</p>
                  <p>{new Date(el.lastCheck!).toLocaleTimeString()}</p>
                </div>
                <div className="flex gap-2 items-center flex-row">
                  <div className="relative">
                    <div
                      className={` animate-ping w-4 h-4 ${
                        el.isPaused
                          ? "bg-yellow-600"
                          : el.statuscode === 200
                          ? " bg-green-600"
                          : "bg-red-600"
                      } rounded-full relative z-[1]`}
                    ></div>
                    <div
                      className={`${
                        el.isPaused
                          ? "bg-yellow-700"
                          : el.statuscode === 200
                          ? "bg-green-700"
                          : "bg-red-700"
                      } rounded-full h-3 w-3 top-[2px] left-[2px] absolute z-[10]`}
                    ></div>
                  </div>

                  <p className="text-white font-medium">
                    {el.isPaused
                      ? "paused"
                      : el.statuscode === 200
                      ? "up"
                      : "down"}
                  </p>
                  <div className=" pl-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical color="white" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className=" text-white flex flex-col gap-2 border-white border-2 rounded-sm py-3 px-1 mt-5 ml-10">
                        <DropdownMenuLabel className=" pr-4 pl-2 border-b-2 text-gray-300">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator></DropdownMenuSeparator>
                        <DropdownMenuItem className="pr-4 pl-2 cursor-pointer">
                          edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="pr-4 pl-2 cursor-pointer"
                          onClick={() => queryMutation.mutate({ id: el.id })}
                        >
                          pause
                        </DropdownMenuItem>
                        <DropdownMenuItem className="pr-4 pl-2 cursor-pointer">
                          delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className=" text-white font-medium">No data</p>
          )}
        </div>
      </div>
    </div>
  );
}
