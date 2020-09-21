require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioNumber = process.env.TWILIO_NUMBER;


// expected obj = { phone: 1234567890, orderID: 1, time: 20 }
const orderAccepted = obj => {
  const msg = `Hi labber =D We just want to let you know that your order was accepted! The order id is #${obj.orderID} and it should be ready in ${obj.time} minutes. We will send another SMS when it is ready for pick-up.`
  client.messages
    .create({
      body: msg,
      from: twilioNumber,
      to: '+1' + obj.phone
    })
    .then(message => console.log(message.sid));
};
// orderAccepted({ phone: 6475406051, orderID: 1, time: 20 })

// expected obj = { phone: 1234567890, reason: 'Ice cream is out of stock' }
const orderDeclined = obj => {
  const reason = obj.reason ? ' ' + obj.reason.charAt(0).toUpperCase() + obj.reason.slice(1) + '.' : '';
  const msg = `Sorry, we are not able to take your order today.${reason}`
  client.messages
    .create({
      body: msg,
      from: twilioNumber,
      to: '+1' + obj.phone
    })
    .then(message => console.log(message.sid));
};
// orderDeclined({ phone: 6475406051, reason: 'we are out of stock' });
// orderDeclined({ phone: 6475406051 });


// expected obj = { phone: 1234567890, orderID: 1 }
const orderDone = obj => {
  const labberEatsLocation = '5455 Gaspe Ave Suite 710, Montreal, Quebec H2T 3B3';
  const msg = `Hi labber =] We are glad to inform that the order #${obj.orderID} is ready for pick-up. You can find us in: ${labberEatsLocation}.`
  client.messages
    .create({
      body: msg,
      from: twilioNumber,
      to: '+1' + obj.phone
    })
    .then(message => console.log(message.sid));
};
// orderDone({phone: 6475406051, orderID: 1})

module.exports = { orderAccepted, orderDeclined, orderDone };
