// // const { MailtrapClient } = require("mailtrap");
// import { MailtrapClient } from 'mailtrap';
// import dotenv from 'dotenv'
// dotenv.config()
// const TOKEN = process.env.MAILTRAP_TOKEN
// const ENDPOINT = process.env.MAILTRAP_ENDPOINT
// console.log(TOKEN,ENDPOINT)
// const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

// const sender = {
//   email: "mailtrap@demomailtrap.com",
//   name: "Soumya Biswas",
// };

// const recipients = [
//   {
//     email: "biswassoumya0023@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);

import { MailtrapClient } from "mailtrap";

const TOKEN = "1a191693c259994a563e2797a19774c9";
const ENDPOINT = "https://send.api.mailtrap.io/";

export const mailtrapClient = new MailtrapClient({
  endpoint: ENDPOINT,
  token: TOKEN
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test"
};

// const recipients = [
//   {
//     email: "biswassoumya0023@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
