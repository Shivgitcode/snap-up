"use server";
import { auth } from "@/server/auth";
import axios from "axios";
export async function sendNotification(
  errorDetails: string,
  responseTime: number,
  url: string
) {
  const session = await auth();
  console.log("this is inside sendNotification section", session);
  console.log("function is triggered");

  try {
    const response = await axios.post(
      "http://localhost:3000/api/send",
      {
        firstName: session?.user?.name,
        email: session?.user?.email,
        websiteUrl: url,
        errorDetails,
        estimatedResolutionTime: responseTime,
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );
    if (response.status === 200) {
      console.log("Notification sent successfully");
    }
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}
