// id = order_id
// phone = phone according to the database
// type = 'confirmed' || 'ready' || 'declined'
// estimatedTime should be passed as the result of evaluating type and msg or database

// input = obj
const sendSMSToUser = obj => {
  try {
    const { id, phone, type, estimatedTime, msg } = obj;
    require('dotenv').config();
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    const twilioNumber = process.env.TWILIO_NUMBER;

    const predefinedText = {
      'confirmed': `Thank you for your order \\o/\nIt should be ready in ${msg || estimatedTime} minutes.\nYou will receive a new SMS when it's ready.`,
      'ready': 'Your order is ready for pick-up!\nThank you! =]',
      'declined': 'Sorry for any inconvenience =['
    };
    let body;
    if (type === 'confirmed') {
      body = predefinedText[type]
    } else {
      body = msg ? (msg.charAt(0)).toString().toUpperCase() + msg.slice(1) : predefinedText[type];
    }

    let sms = `Labber Eats order #${id}\nStatus: ${type}\n\n${body}`

    client.messages
      .create({
        body: sms,
        from: twilioNumber,
        to: '+1' + phone
      })
      .then(message => console.log(message.sid));
  } catch (err) {
    console.log(err);
  }
};

const sendSMSToRestaurant = (msg) => {
  try {
    require('dotenv').config();
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    const twilioNumber = process.env.TWILIO_NUMBER;
    const myNumber = process.env.MY_NUMBER;
    client.messages
      .create({
        body: msg,
        from: twilioNumber,
        to: myNumber
      })
      .then(message => console.log(message.sid));
  } catch (err) {
    console.log(err);
  }
};

// // // test default msgs
// sendSMSToUser({ id: 1, phone: 6475406051, type: 'confirmed', estimatedTime: 20 }) // ==> ok
// sendSMSToUser({ id: 2, phone: 6475406051, type: 'declined' }) // ==> ok
// sendSMSToUser({ id: 3, phone: 6475406051, type: 'ready' }) // ==> ok

// // test restaurant input
// sendSMSToUser({ id: 4, phone: 6475406051, type: 'confirmed', estimatedTime: 20, msg: '30' }) // ==> ok
// sendSMSToUser({ id: 5, phone: 6475406051, type: 'confirmed', msg: '30' }) // ==> ok
// sendSMSToUser({ id: 6, phone: 6475406051, type: 'declined', msg: 'no service today' }) // ==> ok
// sendSMSToUser({ id: 7, phone: 6475406051, type: 'ready', msg: 'come and get it' }) // ==> ok

module.exports = { sendSMSToUser, sendSMSToRestaurant };
