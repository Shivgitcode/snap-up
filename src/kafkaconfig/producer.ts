import { kafka } from "./client";

export async function createProducer({
  statuscode,
  responseTime,
}: {
  statuscode: number;
  responseTime: number;
}) {
  const produce = kafka.producer();
  await produce.connect();
  console.log("producer connected");
  await produce.send({
    topic: "update-monitor",
    messages: [
      {
        key: "hello",
        value: JSON.stringify({ statuscode, responseTime }),
      },
    ],
  });
}
