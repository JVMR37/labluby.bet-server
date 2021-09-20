"use strict";
const express = require("express");
const { Kafka } = require("kafkajs");
const emailSender = require("./email_sender");
const app = express();
const port = 3000;

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:29092"],
});

app.get("/send", async (req, res) => {
  const producer = kafka.producer();

  await producer.connect();
  await producer.send({
    topic: "new-bet",
    messages: [{ value: "Hello KafkaJS user!" }],
  });

  await producer.disconnect();

  res.send("Hello World!");
});

app.get("/start_receiver", async (req, res) => {
  const consumer = kafka.consumer({ groupId: "test-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "new-bet", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
});

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);

  const consumer = kafka.consumer({ groupId: "test-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "new-bet", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      emailSender();
      console.log({
        value: message.value.toString(),
      });
    },
  });
});
