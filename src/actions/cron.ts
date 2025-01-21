import axios from "axios";
import cron from "node-cron";

cron.schedule("*/3 * * * *", async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/trpc/updateMonitor"
    );
    console.log("running cron job");
    return response.data;
  } catch (error) {
    return error;
  }
});
console.log("hello");
