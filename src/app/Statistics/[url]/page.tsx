"use client";
import { DualStatusGraph, StatusGraph } from "@/components/StatusGraph";
import { useParams } from "next/navigation";

export default function Statistics() {
  const params = useParams();
  console.log("these are params", params);
  return (
    <div className="w-full">
      <StatusGraph urlId={params.url as string}></StatusGraph>
      <DualStatusGraph urlId={params.url as string}></DualStatusGraph>
    </div>
  );
}
