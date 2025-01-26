import { kafka } from "./client";

const start = async () => {
  const admin = kafka.admin();
  console.log("kafka connecting");
  await admin.connect();
  console.log("kafka connected");
  await admin.createTopics({
    topics: [
      {
        topic: "update-monitor",
        numPartitions: 3,
      },
    ],
  });
  console.log("topic created");
  await admin.disconnect();
  console.log("kafka disconnected");
};

start();
