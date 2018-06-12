'use-strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
require('dotenv').config()
const {
  getStarted,
  identify,
  foreigner,
  thai,
  traveler,
  partner,
  localExpert,
  ticket,
  feedback,
  support,
  rating,
} = require('./config/payload');
const { messages } = require('./config/messages');

const port = process.env.PORT || 1337;
const pageAccessToken = process.env.PAGE_ACCESS_TOKEN
const appId = process.env.APP_ID;

app = express().use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(function (entry) {
      console.log("entry: ", JSON.stringify(entry));
      let webhook_event = null;

      if (entry.messaging) {
        webhook_event = entry.messaging[0];
      } else {
        webhook_event = entry.standby[0];
      }
      // console.log("WEBHOOK_EVENT: ", webhook_event);
      const sender_psid = webhook_event.sender.id;
      const recipient_psid = webhook_event.recipient.id;
      // console.log('Sender PSID: ' + sender_psid);
      const message = webhook_event.message;
      const postback = webhook_event.postback;
      if (message) {
        if (message.quick_reply && message.quick_reply !== undefined) {
          handlePostback(recipient_psid, sender_psid, message.quick_reply);
        } else if (message.text && message.text !== undefined) {
          handlePostback(recipient_psid, sender_psid, { payload: identify });
        } else if (message.postback && message.postback !== undefined) {
          handlePostback(recipient_psid, sender_psid, message.postback);
        }
      } else if (postback) {
        handlePostback(recipient_psid, sender_psid, postback);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.get('/webhook', (req, res) => {

  let verifyToken = process.env.VERIFY_TOKEN;
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

function handlePostback(recipient_psid, sender_psid, received_postback) {
  // console.log("POSTBACK: ", JSON.stringify(received_postback));
  switch (received_postback.payload) {
    case identify || getStarted:
      callSendAPI(sender_psid, messages.identify);
      break;
    case traveler.main:
      callSendAPI(sender_psid, messages.traveler.main);
      break;
    case traveler.accountSetting:
      callSendAPI(sender_psid, messages.traveler.accountSetting);
      break;
    case traveler.bookingProcess:
      callSendAPI(sender_psid, messages.traveler.bookingProcess);
      break;
    case traveler.paymentProcess:
      callSendAPI(sender_psid, messages.traveler.paymentProcess);
      break;
    case traveler.postTripProcess:
      callSendAPI(sender_psid, messages.traveler.postTripProcess);
      break;
    case traveler.cancellationPolicy:
      callSendAPI(sender_psid, messages.traveler.cancellationPolicy);
      break;
    case partner:
      callSendAPI(sender_psid, messages.partner);
      break;
    case localExpert.main:
      callSendAPI(sender_psid, messages.localExpert.main);
      break;
    case localExpert.accountSetting:
      callSendAPI(sender_psid, messages.localExpert.accountSetting);
      break;
    case localExpert.bookingProcess:
      callSendAPI(sender_psid, messages.localExpert.bookingProcess);
      break;
    case localExpert.postTripProcess:
      callSendAPI(sender_psid, messages.localExpert.postTripProcess);
      break;
    case localExpert.tripListing:
      callSendAPI(sender_psid, messages.localExpert.tripListing);
      break;
    case localExpert.cancellationPolicy:
      callSendAPI(sender_psid, messages.localExpert.cancellationPolicy);
      break;
    case ticket:
      break;
    case feedback:
      callSendAPI(sender_psid, messages.feedback);
      break;
    case support:
      const request_body = {
        "recipient": {
          "id": recipient_psid
        },
        "target_app_id": appId,
        "metadata": "Go to page inbox"
      };
      request({
        "uri": "https://graph.facebook.com/v2.6/me/pass_thread_control",
        "qs": { "access_token": pageAccessToken },
        "method": "POST",
        "json": request_body
      }, (err, res, body) => {
        if (!err) {
          console.log('Go to inbox page!');
          handleMessage(sender_psid, "Wait a minute");
        } else {
          console.error("Unable to go to inbox page:" + err);
        }
      });
      break;
    case rating.main:
      break;
    case rating.one:
      break;
    case rating.two:
      break;
    case rating.three:
      break;
    case rating.four:
      break;
    case rating.five:
      break;
    default:
      break;
  }
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  console.log("REQUEST: ", JSON.stringify(request_body));

  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": pageAccessToken },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable gitto send message:" + err);
    }
  });
}

app.listen(port, () => console.log(`Messenger Webhook is listening on PORT ${port}`));
