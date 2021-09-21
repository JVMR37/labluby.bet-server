"use strict";
const nodemailer = require("nodemailer");
const fs = require("fs");

const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const handlebars = require("handlebars");

module.exports = async function emailSender(message) {
  const messageObject = JSON.parse(message);
  console.log(messageObject);
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "25e2bf32b10c04",
      pass: "4bed2cbbb922dd",
    },
  });

  let html = await readFile("./resources/new_bet.html", "utf8");
  let template = handlebars.compile(html);
  let data = {
    username: messageObject.userName,
    amountOfBets: messageObject.amountOfBets,
    date: messageObject.createdAtDate,
  };
  let htmlToSend = template(data);

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'Kafka Ghost 👻" <mensageria@labluby.bet>', // sender address
    to: messageObject.adminsEmails, // list of receivers
    subject: "New Bets ✔", // Subject line
    text: "Hello world?", // plain text body
    html: htmlToSend,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
