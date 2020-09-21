require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioNumber = process.env.TWILIO_NUMBER;

// id = order_id
// phone = phone according to the database
// type = 'confirmed' || 'ready' || 'declined'
// estimatedTime should be passed as the result of evaluating type and msg or database
const sendSMSToUser = (id, phone, type, estimatedTime, msg) => {
  const predefinedText = {
    'confirmed': `Thank you for your order \\o/\nIt should be ready in ${estimatedTime} minutes.\nYou will receive a new SMS when it's ready.`,
    'ready': 'Your order is ready for pick-up!\nThank you! =]',
    'declined': 'Sorry for any inconvenience =['
  };
  let body = msg ? msg : predefinedText[type];

  let sms = `Labber Eats order #${id}\nStatus: ${type}\n${body}`

  client.messages
    .create({
      body: sms,
      from: twilioNumber,
      to: '+1' + phone
    })
    .then(message => console.log(message.sid));

}
// sendSMSToUser(1, 6475406051, 'confirmed', 20) // ==> ok
// sendSMSToUser(2, 6475406051, 'declined', 20) // ==> ok
// sendSMSToUser(3, 6475406051, 'ready', 20) // ==> ok
// sendSMSToUser(4, 6475406051, 'confirmed', 20, '30 minutes') // ==> ok
// sendSMSToUser(5, 6475406051, 'declined', 20, 'no service today') // ==> ok
// sendSMSToUser(6, 6475406051, 'ready', 20, 'come and get it') // ==> ok

module.exports = { sendSMSToUser };
