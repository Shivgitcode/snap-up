import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "snap-up",
  brokers: ["localhost:9092"],
});
