// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioNumber = process.env.TWILIO_NUMBER;
const myNumber = process.env.MY_NUMBER;

const sendSMS = (msg) => {
  client.messages
    .create({
      body: msg,
      from: twilioNumber,
      to: myNumber
    })
    .then(message => console.log(message.sid));
};

module.exports = { sendSMS };
