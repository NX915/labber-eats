// id = order_id
// phone and estimated_wait = according to the database
// type = 'confirmed' || 'ready' || 'declined'

let activateSMS = process.env.ACTIVATE_SMS;

const sendSMSToUser = obj => {
  // build the sms according with the information received
  const { id, phone, type, estimated_wait, input } = obj;
  const predefinedText = {
    'confirmed': `Thank you for your order \\o/\nIt should be ready in ${input || estimated_wait} minutes.\nYou will receive a new SMS when it's ready.`,
    'ready': 'Your order is ready for pick-up!\nThank you! =]',
    'declined': 'Sorry for any inconvenience =['
  };
  let body;
  if (type === 'confirmed') {
    body = predefinedText[type];
  } else {
    body = input ? (input.charAt(0)).toString().toUpperCase() + input.slice(1) : predefinedText[type];
  }
  let sms = `Labber Eats order #${id}\nStatus: ${type}\n\n${body}`;

  // try to send SMSs if the service is activated
  if (activateSMS === 'true') {
    try {
      require('dotenv').config();
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);
      const twilioNumber = process.env.TWILIO_NUMBER;

      client.messages
        .create({
          body: sms,
          from: twilioNumber,
          to: '+1' + phone
        })
        .then(message => console.log('SMS sent to costumer. String Identifier(SID):', message.sid))
        .catch(e => console.log(e.message));
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log('SMS sent to costumer:');
    console.log(sms);
  }
};

// // // test default msgs
// sendSMSToUser({ id: 1, phone: 6475406051, type: 'confirmed', estimated_wait: 20 }) // ==> ok
// sendSMSToUser({ id: 2, phone: 6475406051, type: 'declined' }) // ==> ok
// sendSMSToUser({ id: 3, phone: 6475406051, type: 'ready' }) // ==> ok

// // test restaurant input
// sendSMSToUser({ id: 4, phone: 6475406051, type: 'confirmed', estimated_wait: 20, input: '30' }) // ==> ok
// sendSMSToUser({ id: 5, phone: 6475406051, type: 'confirmed', input: '30' }) // ==> ok
// sendSMSToUser({ id: 6, phone: 6475406051, type: 'declined', input: 'no service today' }) // ==> ok
// sendSMSToUser({ id: 7, phone: 6475406051, type: 'ready', input: 'come and get it' }) // ==> ok

const sendSMSToRestaurant = (msg) => {
  if (activateSMS === 'true') {
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
  }
};

module.exports = { sendSMSToUser, sendSMSToRestaurant };
