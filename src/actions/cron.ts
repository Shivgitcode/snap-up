import axios from "axios";
import cron from "node-cron";

cron.schedule("3 * * * *", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/trpc/updateMonitor"
    );
    return response.data;
  } catch (error) {
    return error;
  }
});
