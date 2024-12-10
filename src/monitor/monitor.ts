"use server";

import { db } from "@/drizzle/db";
import { Monitor, monitors } from "@/drizzle/schema";
import axios from "axios";
import { error } from "console";
import { eq } from "drizzle-orm";

async function checkWebsiteStatus(website: { id: string; url: string }[]) {
  const response = await axios.get(website[0].url as string);
  if (response.status === 200) {
    const updateMonitorStatus = await db
      .update(monitors)
      .set({ status: "success", statuscode: response.status })
      .where(eq(monitors.id, website[0].id))
      .returning({
        status: monitors.status,
      });
    console.log(updateMonitorStatus);
  } else {
    const updateMonitorStatus = await db
      .update(monitors)
      .set({ status: "failed", statuscode: response.status })
      .where(eq(monitors.id, website[0].id))
      .returning({
        status: monitors.status,
      });
    console.log(error);
    console.log(updateMonitorStatus);
  }
}

export { checkWebsiteStatus };
