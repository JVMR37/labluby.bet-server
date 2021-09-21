"use strict";
const express = require("express");
const { Kafka } = require("kafkajs");
const emailSender = require("./email_sender");
const app = express();
const port = 3000;

app.get('/teste', function (req, res) {
  res.send('Ta tudo Ok por aqui, e aí ?')
})

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
  const kafka = new Kafka({
    clientId: "MS-EMAILS",
    brokers: ["broker:29092"],
  });

  const consumer = kafka.consumer({ groupId: "test-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "new-bet", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      emailSender(message.value);
      console.log({
        value: message.value.toString(),
      });
    },
  });
});
